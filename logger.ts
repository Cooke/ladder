import pino from "pino";
import { env } from "./app/services/env.server";
import pinoToSeq from "pino-seq";

let transport;
if (env.SEQ_SERVER) {
  transport = pinoToSeq.createStream({
    serverUrl: env.SEQ_SERVER,
    apiKey: env.SEQ_API_KEY,
  });
}

export const logger = pino(transport);
