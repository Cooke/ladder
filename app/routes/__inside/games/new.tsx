import {
  Container,
  FormControl,
  FormLabel,
  Heading,
  Select,
  VStack,
} from "@chakra-ui/react";
import { LoaderArgs, redirect } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { ensureSession } from "~/services/auth.server";

import { db } from "~/services/db.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  await ensureSession(request);

  var ladders = await db.ladder.findMany();

  if (params.ladderId && !ladders.some((x) => x.id === params.ladderId)) {
    return redirect("./");
  }

  return ladders;
};

export default function Index() {
  const navigate = useNavigate();
  const ladders = useLoaderData<typeof loader>();
  const { ladderId } = useParams();

  return (
    <>
      <Container>
        <VStack alignItems="stretch">
          <Heading>Rapportera resultat</Heading>
          <FormControl>
            <FormLabel>Stege</FormLabel>
            <Select
              value={ladderId}
              onChange={(ev) =>
                navigate(`/games/new/${ev.currentTarget.value}`)
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

          <Outlet />
        </VStack>
      </Container>
    </>
  );
}
