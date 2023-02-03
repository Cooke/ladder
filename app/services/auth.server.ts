import env from "env.mjs";
import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { sessionStorage } from "~/services/session.server";
import { db } from "./db.server";

export interface Session {
  userId: string;
}

export const googleProvider = "google";

let googleStrategy = new GoogleStrategy<Session>(
  {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: env.BASE_URL + "/auth/google/callback",
  },
  async ({ profile }) => {
    const providerAccountId = profile.id;

    console.log("New google login", profile);

    let user = await db.user.findFirst({
      select: {
        id: true,
      },
      where: {
        externalLogins: {
          some: {
            provider: googleProvider,
            providerAccountId,
          },
        },
      },
    });

    if (!user) {
      try {
        const login = await db.externalLogin.create({
          data: {
            provider: googleProvider,
            providerAccountId,
            user: {
              connectOrCreate: {
                create: {
                  email: profile.emails[0].value,
                  name: profile._json.name,
                },
                where: {
                  email: profile.emails[0].value,
                },
              },
            },
          },
          select: {
            userId: true,
          },
        });
        user = { id: login.userId };
      } catch (error) {
        console.error("Failed to create new user", error);
        throw error;
      }
    }

    return { userId: user.id };
  }
);

export let authenticator = new Authenticator<Session>(sessionStorage);

authenticator.use(googleStrategy);

export async function ensureSession(request: Request) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });
}
