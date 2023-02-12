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
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
                user: {
                  select: {
                    name: true,
                    _count: {
                      select: {
                        user1Games: {
                          where: {
                            season: {
                              ladderId,
                            },
                          },
                        },
                        user2Games: {
                          where: {
                            season: {
                              ladderId,
                            },
                          },
                        },
                      },
                    },
                  },
                },
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
      <Card>
        <CardHeader>
          <Heading>{ladder.name}</Heading>
        </CardHeader>
        <CardBody>
          {standings.length > 0 ? (
            <>
              <TableContainer>
                <Table size={"sm"}>
                  <Thead>
                    <Tr>
                      <Th isNumeric>#</Th>
                      <Th>Namn</Th>
                      <Th isNumeric>Matcher</Th>
                      <Th isNumeric>Poäng</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {standings.map((member, index) => (
                      <Tr
                        key={index}
                        bg={
                          member.userId === userId
                            ? "oragnge-salmon"
                            : undefined
                        }
                      >
                        <Td isNumeric>{index + 1}</Td>
                        <Td w="100%">{member.user.name}</Td>
                        <Td isNumeric>
                          {member.user._count.user1Games +
                            member.user._count.user2Games}
                        </Td>
                        <Td isNumeric>{member.rating}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              <Flex justify={"right"}>
                <Button
                  mt="md"
                  as={RemixLink}
                  to={`/games/new/${ladder.id}`}
                  variant="secondary"
                  width={{
                    base: "100%",
                    sm: "auto",
                  }}
                >
                  Registrera nytt resultat
                </Button>
              </Flex>
            </>
          ) : (
            <Button
              as={RemixLink}
              to={`/games/new/${ladder.id}`}
              variant="secondary"
              width={{
                base: "100%",
                sm: "auto",
              }}
            >
              Registrera första resultat
            </Button>
          )}
        </CardBody>
      </Card>
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
