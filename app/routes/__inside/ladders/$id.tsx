import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  VStack,
  Text,
} from "@chakra-ui/react";
import { json, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData, useLocation, useMatches } from "@remix-run/react";
import { RemixLink } from "~/components/RemixLink";
import { ensureSession } from "~/services/auth.server";

import { db } from "~/services/db.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const { userId } = await ensureSession(request);
  const ladderId = params.id;

  return json({
    ladder: await db.ladder.findUniqueOrThrow({
      where: { id: ladderId },
      include: {
        currentSeason: {
          include: {
            standings: {
              include: {
                user: true,
              },
              orderBy: {
                rating: "desc",
              },
            },
          },
        },
      },
    }),
    userId,
  });
};

export default function Index() {
  const { ladder, userId } = useLoaderData<typeof loader>();

  const standings = ladder.currentSeason!.standings;
  return (
    <Container>
      <HStack mb="4">
        <Heading mr="auto">{ladder.name}</Heading>
      </HStack>
      <Heading as="h2" size={"md"}>
        Ställning
      </Heading>
      <VStack alignItems="stretch">
        <Row
          pos={<Text color="blue">#</Text>}
          name={"Namn"}
          score="Poäng"
        ></Row>
        {standings.map((member, index) => (
          <Row
            key={index}
            pos={index + 1}
            name={member.user.name}
            score={member.rating}
          ></Row>
        ))}
      </VStack>
      <Button as={RemixLink} to={`/games/new/${ladder.id}`}>
        Registrera resultat
      </Button>
    </Container>
  );
}

const Row = ({
  pos,
  name,
  score,
}: {
  pos: React.ReactNode;
  name: React.ReactNode;
  score: React.ReactNode;
}) => {
  return (
    <HStack>
      <Box>{pos}</Box>
      <Box flex={1}>{name}</Box>
      <Box>{score}</Box>
    </HStack>
  );
};
