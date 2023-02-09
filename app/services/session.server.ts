import { env } from "~/services/env.server";
import { createCookieSessionStorage } from "@remix-run/node";

export const sessionCookieName = "_session";

// export the whole sessionStorage object
export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: sessionCookieName, // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [env.SESSION_SECRET], // replace this with an actual secret
    secure: env.NODE_ENV === "production", // enable this in prod only
  },
});

// you can also export the methods individually for your own usage
export let { getSession, commitSession, destroySession } = sessionStorage;
