import { ActionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export let action = ({ request }: ActionArgs) => {
  return authenticator.logout(request, { redirectTo: "/" });
};
