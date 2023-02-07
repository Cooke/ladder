import pino from "pino";
import { env } from "./env.mjs";

let transport;
if (env.LOGTAIL_TOKEN) {
  transport = pino.transport({
    target: "@logtail/pino",
    options: { sourceToken: env.LOGTAIL_TOKEN },
  });
}

export const logger = pino(transport);
