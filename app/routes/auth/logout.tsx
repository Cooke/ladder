import { ActionArgs } from "@remix-run/node";
import { authenticator, ensureSession } from "~/services/auth.server";
import { logger } from "~/services/logger.server";

export let action = async ({ request }: ActionArgs) => {
  const session = await ensureSession(request);
  logger.info(
    { userId: session.userId },
    "Logging out user %s",
    session.userId
  );
  return authenticator.logout(request, { redirectTo: "/" });
};
