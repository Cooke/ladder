import { Button, FormControl, FormLabel, Select } from "@chakra-ui/react";
import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData, useParams } from "@remix-run/react";
import { z } from "zod";
import { ensureSession } from "~/services/auth.server";

import { useAppForm } from "~/hooks/useAppForm";
import { db } from "~/services/db.server";
import { zx } from "zodix";
import { calculateNewRating } from "~/services/elo.server";

const newGameSchema = z.object({
  opponentUserId: z.string().cuid(),
  result: z.enum(["win", "loss"]),
});

export const loader = async ({ request, params }: LoaderArgs) => {
  const session = await ensureSession(request);

  return await db.user.findMany({
    where: {
      id: {
        not: session.userId,
      },
    },
  });
};

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

      const newRatings = calculateNewUserRatings(
        standingUser1.rating,
        standingUser2.rating,
        input.result === "win"
      );

      await updateStandingRating(user1Id, newRatings.user1Rating);
      await updateStandingRating(user2Id, newRatings.user2Rating);

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

function calculateNewUserRatings(
  user1Rating: number,
  user2Rating: number,
  user1Won: boolean
) {
  if (user1Won) {
    const newRatings = calculateNewRating(user1Rating, user2Rating);
    return {
      user1Rating: newRatings.winnerRating,
      user2Rating: newRatings.loserRating,
    };
  } else {
    const newRatings = calculateNewRating(user2Rating, user1Rating);
    return {
      user1Rating: newRatings.loserRating,
      user2Rating: newRatings.winnerRating,
    };
  }
}

export default function Index() {
  const { register, handleSubmit, formState } = useAppForm(newGameSchema);
  const { ladderId } = useParams();
  const opponents = useLoaderData<typeof loader>();

  return (
    <>
      <Form method="post" onSubmit={handleSubmit}>
        <input type="hidden" value={ladderId} />
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
          </Select>
        </FormControl>

        <Button type="submit">Registrera</Button>
      </Form>
    </>
  );
}
