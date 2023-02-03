import {
  Button,
  Card,
  CardHeader,
  Container,
  Heading,
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
    ladders: await db.ladder.findMany(),
  });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <Container>
        <Heading mb="lg">Stegar</Heading>
        <VStack alignItems="stretch">
          {data.ladders.map((ladder) => (
            <Card key={ladder.id} as={RemixLink} to={`/ladders/${ladder.id}`}>
              <CardHeader>{ladder.name}</CardHeader>
            </Card>
          ))}
        </VStack>
        {data && data.ladders.length === 0 && (
          <VStack>
            <Text>Det finns inga stegar ännu</Text>
          </VStack>
        )}
        <Button as={RemixLink} to="/ladders/new">
          Skapa en ny stege
        </Button>
      </Container>
    </>
  );
}
