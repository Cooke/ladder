// Make sure environment variables are valid
import "./app/services/env.server";
import * as build from "@remix-run/dev/server-build";
import { createRequestHandler } from "@remix-run/vercel";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { createRequestContext, logRequest } from "./common";

const requestHandler = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (req) => (req as any).context,
});

export default async (req: VercelRequest, res: VercelResponse) => {
  const context = createRequestContext();
  (req as any).context = context;

  res.on("finish", () => {
    logRequest(context, {
      url: req.url,
      method: req.method,
      statusCode: res.statusCode,
    });
  });
  return requestHandler(req, res);
};
