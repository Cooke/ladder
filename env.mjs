// @ts-check
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  SESSION_SECRET: z.string().min(10),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  BASE_URL: z.string().url(),
  LOGTAIL_TOKEN: z.string().optional()
});

/**
 * @type {{ [k in keyof z.infer<typeof schema>]: z.infer<typeof schema>[k] | undefined }}
 */
const raw = {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  SESSION_SECRET: process.env.SESSION_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  BASE_URL: process.env.BASE_URL,
  LOGTAIL_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN
};

const parseResult = schema.safeParse(raw);

if (!parseResult.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    parseResult.error.format()
  );
  throw new Error("Invalid environment variables");
}

const env = parseResult.data;
export { env };
export default env;
