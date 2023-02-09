import pino from "pino";
import { env } from "./app/services/env.server";
import logtailTransport from "@logtail/pino";

let transport;
if (env.LOGTAIL_TOKEN) {
  // Make sure logtail transport is not tree shaken away
  logtailTransport;

  transport = pino.transport({
    target: "@logtail/pino",
    options: { sourceToken: env.LOGTAIL_TOKEN },
  });
}

export const logger = pino(transport);
