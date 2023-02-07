import { ActionArgs } from "@remix-run/node";
import { authenticator, ensureSession } from "~/services/auth.server";

export let action = async ({ request, context }: ActionArgs) => {
  const session = await ensureSession(request);
  context?.logger.info(
    { userId: session.userId },
    "Logging out user %s",
    session.userId
  );
  return authenticator.logout(request, { redirectTo: "/" });
};
