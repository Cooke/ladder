import path from "path";
import express, { NextFunction, Request, Response } from "express";
import compression from "compression";
import { createRequestHandler } from "@remix-run/express";
import { createRequestContext, logRequest } from "servers/common";

const buildPath = path.join(process.cwd(), "api/index.js");
const publicPath = "/build/";
const assetsBuildDirectory = "public/build";
const mode = process.env.NODE_ENV;

let app = express();

app.disable("x-powered-by");

app.use(compression());

app.use(
  publicPath,
  express.static(assetsBuildDirectory, { immutable: true, maxAge: "1y" })
);

app.use(express.static("public", { maxAge: "1h" }));

app.use((req, res, next) => {
  const context = createRequestContext();
  res.locals.context = context;

  res.on("finish", () => {
    logRequest(context, {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
    });
  });

  next();
});

const requesthandler =
  mode === "production"
    ? createRequestHandler({
        build: require(buildPath),
        mode,
        getLoadContext: (_req, res) => res.locals.context,
      })
    : (req: Request, res: Response, next: NextFunction) => {
        purgeRequireCache();
        let build = require(buildPath);
        return createRequestHandler({
          build,
          mode,
          getLoadContext: (_req, res) => res.locals.context,
        })(req, res, next);
      };

app.all("*", requesthandler);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`✅ app ready..: http://localhost:${port}`);
});

(["SIGTERM", "SIGINT"] as const).forEach((signal) => {
  process.once(signal, () => server?.close(console.error));
});

function purgeRequireCache() {
  for (const key in require.cache) {
    if (key.startsWith(buildPath)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete require.cache[key];
    }
  }
}
