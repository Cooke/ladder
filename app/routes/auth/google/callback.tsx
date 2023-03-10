import { LoaderArgs } from "@remix-run/node";
import { authenticator, googleProvider } from "~/services/auth.server";

export let loader = ({ request, context }: LoaderArgs) => {
  return authenticator.authenticate(googleProvider, request, {
    successRedirect: "/overview",
    failureRedirect: "/?callback_error",
    context,
  });
};
