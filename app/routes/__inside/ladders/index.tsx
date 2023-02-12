import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Heading,
  HStack,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { RemixLink } from "~/components/RemixLink";
import { ensureSession } from "~/services/auth.server";

import { db } from "~/services/db.server";

export const loader = async ({ request }: LoaderArgs) => {
  await ensureSession(request);
  return json({
    ladders: await db.ladder.findMany({
      include: {
        currentSeason: {
          include: {
            _count: {
              select: {
                games: true,
                standings: true,
              },
            },
          },
        },
      },
    }),
  });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <Container>
      <Heading mb="lg">Stegar</Heading>
      <VStack alignItems="stretch" spacing="md">
        {data.ladders.map((ladder) => (
          <Card
            key={ladder.id}
            as={RemixLink}
            to={`/ladders/${ladder.id}`}
            border="1px solid transparent"
            _hover={{
              shadow: "sm",
            }}
            role="group"
          >
            <CardBody>
              <HStack>
                <Heading flex={1} size={"md"}>
                  {ladder.name}
                </Heading>
                <Text color="text-soft" fontSize={"sm"}>
                  {ladder.currentSeason?._count.standings} deltagare
                </Text>
                <Text
                  width={100}
                  textAlign="right"
                  color="text-soft"
                  fontSize={"sm"}
                >
                  {ladder.currentSeason?._count.games} matcher
                </Text>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      {data && data.ladders.length === 0 && (
        <VStack>
          <Text>Det finns inga stegar ännu</Text>
        </VStack>
      )}

      <Flex mt="md" justify="flex-end" gap={"sm"}>
        <Button
          as={RemixLink}
          to="/ladders/new"
          variant={"secondary"}
          w={["100%", "auto"]}
        >
          Skapa en ny stege
        </Button>
      </Flex>
    </Container>
  );
}
