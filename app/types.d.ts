import pino from "pino";

declare module "@remix-run/server-runtime" {
  interface AppLoadContext {
    requestId: string;
    logger: pino.Logger;
  }
}
