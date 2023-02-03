import { Button } from "@chakra-ui/react";
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
  console.log("session", session.data);
  return json({ error });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <form method="post" action="/auth/google">
        <Button type="submit">Sign in with Google</Button>
        <code>{JSON.stringify(data)}</code>
      </form>
    </>
  );
}
