import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";
import { LoaderArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Navbar from "~/components/Navbar";
import { authenticator } from "~/services/auth.server";
import { getSession, sessionCookieName } from "~/services/session.server";

// in the loader of the login route
export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/overview",
  });
  let session = await getSession(request.headers.get(sessionCookieName));
  let error = session.get(authenticator.sessionErrorKey);
  return json({ error });
}

export default function Index() {
  return (
    <Container centerContent>
      <Heading
        color="primary"
        sx={{ fontSize: 100 }}
        fontWeight="extrabold"
        letterSpacing="tight"
        mt="20"
      >
        Stegen
      </Heading>
      <Box mt="lg">
        <form method="post" action="/auth/google">
          <Button type="submit" variant={"secondary"} size="lg">
            Logga in med Google
          </Button>
        </form>
      </Box>
    </Container>
  );
}
