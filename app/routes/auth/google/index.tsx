import { ActionArgs, redirect } from "@remix-run/node";
import { authenticator, googleProvider } from "~/services/auth.server";

export let loader = () => redirect("/");

export let action = ({ request }: ActionArgs) => {
  return authenticator.authenticate(googleProvider, request);
};
