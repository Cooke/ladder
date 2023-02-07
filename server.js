// Make sure environment variables are valid
import("./env.mjs");
import { createRequestHandler } from "@remix-run/vercel";
import * as build from "@remix-run/dev/server-build";
import { logger as rootLogger } from "./logger.mjs";
import { nanoid } from "nanoid";

const requestHandler = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (req) => req.context,
});

export default async (req, res) => {
  const start = Date.now();
  const requestId = nanoid();
  const logger = rootLogger.child({ requestId });

  req.context = { requestId, logger };

  logger.debug(
    { url: req.url, method: req.method },
    "Request %s %s",
    req.method,
    reg.url
  );

  const result = await requestHandler(req, res);
  const duration = Date.now() - start;
  logger.info(
    { url: req.url, method: req.method, duration },
    "Response %s (%dms)",
    res.statusCode,
    duration
  );
  return result;
};
