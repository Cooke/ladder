import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Select,
  VStack,
} from "@chakra-ui/react";
import { ActionArgs, json, LoaderArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";
import { useAppForm } from "~/hooks/useAppForm";
import { ensureSession } from "~/services/auth.server";

import { db } from "~/services/db.server";
import { calculateNewRating } from "~/services/elo.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const session = await ensureSession(request);

  var laddersPromise = db.ladder.findMany();
  const opponentsPromise = db.user.findMany({
    where: {
      id: {
        not: session.userId,
      },
    },
  });

  const [ladders, opponents] = await Promise.all([
    laddersPromise,
    opponentsPromise,
  ]);

  return json({
    ladders,
    opponents,
  });
};

export const newGameSchema = z.object({
  opponentUserId: z.string().cuid(),
  result: z.enum(["win", "loss", "draw"]),
});

export const action = async ({ request, params }: ActionArgs) => {
  const session = await ensureSession(request);

  const input = await zx.parseForm(request, newGameSchema);
  const { ladderId } = params;

  const ladder = await db.ladder.findFirstOrThrow({
    where: {
      id: ladderId,
    },
  });

  const seasonId = ladder.currentSeasonId!;
  const user1Id = session.userId;
  const user2Id = input.opponentUserId;

  await db.$transaction(
    async (tx) => {
      const standingUser1 = await ensureStanding(user1Id);
      const standingUser2 = await ensureStanding(user2Id);

      const newRatings = calculateNewRating(
        standingUser1.rating,
        standingUser2.rating,
        input.result === "win" ? 1 : input.result === "draw" ? 0.5 : 0
      );

      await updateStandingRating(user1Id, newRatings.player1Rating);
      await updateStandingRating(user2Id, newRatings.player2Rating);

      await tx.game.create({
        data: {
          user1Id,
          user2Id,
          reporterId: session.userId,
          seasonId,
          ...(input.result === "win"
            ? { user1Score: 1, user2Score: 0 }
            : { user1Score: 0, user2Score: 1 }),
        },
      });

      async function updateStandingRating(userId: string, rating: number) {
        await tx.standing.update({
          data: {
            rating,
          },
          where: {
            userId_seasonId: {
              seasonId: seasonId,
              userId,
            },
          },
        });
      }

      async function ensureStanding(userId: string) {
        return await tx.standing.upsert({
          create: {
            rating: 1000,
            seasonId,
            userId,
          },
          update: {},
          where: {
            userId_seasonId: {
              userId,
              seasonId,
            },
          },
        });
      }
    },
    { isolationLevel: "Serializable" }
  );

  return redirect(`/ladders/${ladder.id}`);
};

export default function Index() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useAppForm(newGameSchema);
  const { ladderId } = useParams();
  const { opponents, ladders } = useLoaderData<typeof loader>();

  return (
    <>
      <Container>
        <VStack alignItems="stretch">
          <Card>
            <CardHeader>
              <Heading>Rapportera resultat</Heading>
            </CardHeader>
            <CardBody>
              <Form method="post" onSubmit={handleSubmit}>
                <VStack spacing={"sm"} align="flex-end">
                  <FormControl>
                    <FormLabel>Stege</FormLabel>
                    <Select
                      value={ladderId ?? ""}
                      onChange={(ev) =>
                        navigate(`/games/new/${ev.currentTarget.value}`, {
                          replace: true,
                        })
                      }
                    >
                      <option value="">Välj stege</option>
                      {ladders.map((ladder) => (
                        <option key={ladder.id} value={ladder.id}>
                          {ladder.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isInvalid={!!formState.errors.opponentUserId}>
                    <FormLabel>Motståndare</FormLabel>
                    <Select {...register("opponentUserId")}>
                      <option value="">- Motståndare -</option>
                      {opponents.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isInvalid={!!formState.errors.result}>
                    <FormLabel>Resultat</FormLabel>
                    <Select {...register("result")}>
                      <option value="">- Resultat -</option>
                      <option value="win">Vinst</option>
                      <option value="loss">Förlust</option>
                      <option value="draw">Oavgjort</option>
                    </Select>
                  </FormControl>
                </VStack>
                <Flex justify="flex-end">
                  <Button
                    type="submit"
                    variant={"primary"}
                    mt="lg"
                    width={["100%", "auto"]}
                  >
                    Registrera resultat
                  </Button>
                </Flex>
              </Form>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </>
  );
}
