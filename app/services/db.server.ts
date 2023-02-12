import { PrismaClient } from "@prisma/client";
import { logger } from "logger";
import env from "~/services/env.server";

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (env.NODE_ENV === "production") {
  db = createPrismaClient();
} else {
  if (!global.__db) {
    global.__db = createPrismaClient();
  }
  db = global.__db;
}

function createPrismaClient() {
  const client = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
      {
        emit: "stdout",
        level: "error",
      },
      {
        emit: "stdout",
        level: "info",
      },
      {
        emit: "stdout",
        level: "warn",
      },
    ],
  });

  client.$on("query", (e) => {
    logger.debug(
      { duration: e.duration, target: e.target, tag: "db-query" },
      "Db query: %s (params: %s) (%d ms)",
      e.query,
      e.params,
      e.duration
    );
  });

  return client;
}

export { db };
