import { AppLoadContext } from "@remix-run/node";
import { nanoid } from "nanoid";
import { logger as rootLogger } from "../app/services/logger.server.js";

export function createRequestContext() {
  const requestId = nanoid();
  const logger = rootLogger.child({ requestId });
  console.log(`Logger 2`, !!logger);
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
  const logArguments = [
    { ...data, requestId: context.requestId, duration },
    "%s %s %s (%d ms)",
    data.method,
    data.url,
    data.statusCode,
    duration,
  ] as const;

  if (data.statusCode >= 500) {
    context.logger.error(...logArguments);
  } else {
    context.logger.info(...logArguments);
  }
}
