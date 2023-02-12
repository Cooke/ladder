import { AppLoadContext } from "@remix-run/node";
import { nanoid } from "nanoid";
import { logger as rootLogger } from "../logger.js";

export function createRequestContext() {
  const requestId = nanoid();
  const logger = rootLogger.child({ requestId });
  const requestStart = Date.now();
  return { requestId, logger, requestStart };
}

export function logRequest(
  context: AppLoadContext,
  data: {
    url: string | undefined;
    method: string | undefined;
    statusCode: number;
  }
) {
  const duration = Date.now() - context.requestStart;
  context.logger.info(
    { ...data, requestId: context.requestId, duration },
    "%s %s %s (%d ms)",
    data.method,
    data.url,
    data.statusCode,
    duration
  );
}
