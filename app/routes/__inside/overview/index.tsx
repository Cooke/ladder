import { LoaderArgs } from "@remix-run/node";
import { redirect } from "react-router";
import { ensureSession } from "~/services/auth.server";

export let loader = async ({ request }: LoaderArgs) => {
  await ensureSession(request);
  return redirect("/ladders");
};
