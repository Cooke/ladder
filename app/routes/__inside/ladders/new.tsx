import {
  Button,
  ButtonGroup,
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
    <>
      <Form method="post" onSubmit={handleSubmit}>
        <Container>
          <VStack alignItems="stretch">
            <Heading>Skapa stege</Heading>
            <FormControl isInvalid={!!formState.errors.name}>
              <FormLabel>Namn</FormLabel>
              <Input {...register("name")} name="name" type="text" />
              <FormErrorMessage>
                {formState.errors.name?.message}
              </FormErrorMessage>
            </FormControl>

            <ButtonGroup justifyContent="right">
              <Button variant="outline" as={RemixLink} to="/ladders">
                Avbryt
              </Button>
              <Button colorScheme="teal" type="submit">
                Skapa
              </Button>
            </ButtonGroup>
          </VStack>
        </Container>
      </Form>
    </>
  );
}
