import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { ActionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";
import { ensureSession } from "~/services/auth.server";

import { nanoid } from "nanoid";
import { RemixLink } from "~/components/RemixLink";
import { useAppForm } from "~/hooks/useAppForm";
import { db } from "~/services/db.server";
import { slug } from "~/services/slug.server";

const newLadderSchema = z.object({
  name: z
    .string()
    .min(3, "Namnet måste vara minst 3 tecken långt")
    .max(100, "Namnet får max vara 100 tecken långt")
    .regex(/[\w ]+/, "Namnet får bara innehålla bokstäver och mellanslag"),
});

type NewLadder = z.infer<typeof newLadderSchema>;

export const action = async ({ request, context }: ActionArgs) => {
  var session = await ensureSession(request);
  const newLadder = await zx.parseForm(request, newLadderSchema);

  const ladderId = slug(newLadder.name);
  const [ladder] = await db.$transaction([
    db.ladder.create({
      data: {
        ...newLadder,
        id: ladderId,
        creator: { connect: { id: session.userId } },
        currentSeason: {},
      },
    }),
    db.season.create({
      data: {
        id: nanoid(),
        number: 1,
        ladderId,
        currentSeasonOfLadder: {
          connect: {
            id: ladderId,
          },
        },
      },
    }),
  ]);

  return redirect(`/ladders/${ladder.id}`);
};

export default function Index() {
  const { register, handleSubmit, formState } =
    useAppForm<NewLadder>(newLadderSchema);

  return (
    <Container>
      <Form method="post" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <Heading>Skapa stege</Heading>
          </CardHeader>
          <CardBody>
            <FormControl isInvalid={!!formState.errors.name}>
              <FormLabel>Namn</FormLabel>
              <Input {...register("name")} name="name" type="text" />
              <FormErrorMessage>
                {formState.errors.name?.message}
              </FormErrorMessage>
            </FormControl>

            <ButtonGroup justifyContent={"flex-end"} w="100%" mt="lg">
              <Button variant="secondary" as={RemixLink} to="/ladders">
                Avbryt
              </Button>
              <Button type="submit" variant={"primary"}>
                Skapa stege
              </Button>
            </ButtonGroup>
          </CardBody>
        </Card>
      </Form>
    </Container>
  );
}
