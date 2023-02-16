import pino from "pino";
import { env } from "./env.server";
import pinoToSeq from "pino-seq";

let stream;
if (env.SEQ_SERVER) {
  stream = pinoToSeq.createStream({
    serverUrl: env.SEQ_SERVER,
    apiKey: env.SEQ_API_KEY,
  });
}

export const logger = pino({ level: "debug" }, stream ?? process.stdout);
console.log(`Logger 1`, !!logger);
