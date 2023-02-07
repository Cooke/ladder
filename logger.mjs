import pino from "pino";
import { env } from "./env.mjs";
const logtailTransport = require("@logtail/pino");

let transport;
if (env.LOGTAIL_TOKEN) {
  transport = logtailTransport({ sourceToken: env.LOGTAIL_TOKEN });
}

export const logger = pino(transport);
