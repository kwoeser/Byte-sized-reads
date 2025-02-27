import "reflect-metadata";

import type { MikroORM } from "@mikro-orm/postgresql";
import { initClient } from "@ts-rest/core";
import { newDb } from "pg-mem";
import { contract } from "../apiContract.js";
import { createApp } from "../app.js";
import { testOrmConfig } from "../mikro-orm.config.js";

export type TestApp = Awaited<ReturnType<typeof startTestApp>>;

/**
 * Set up an instance of the API for testing.
 *
 * Creates an in-memory mock database so tests can have individual databases.
 * Also starts the API on a random port and listens for requests. Returns a
 * TestApp with the port and a method to clean up the test.
 */
export const startTestApp = async () => {
  // create an in-memory Postgres mock using pg-mem
  const db = newDb();
  const orm: MikroORM = await db.adapters.createMikroOrm(testOrmConfig);

  // apply the orm schema
  const sql = await orm.getSchemaGenerator().getCreateSchemaSQL();
  await db.public.many(sql);

  // create the express app
  const app = createApp(orm);

  // listen on any open port
  const server = app.listen(0);

  // get the port
  const serverAddress = server.address();
  if (typeof serverAddress === "string" || serverAddress === null) {
    throw new Error("unexpected");
  }
  const serverPort = serverAddress.port;

  // cleanup fn to close http server and database
  const cleanup = async () => {
    await server.close();
    await orm.close();
  };

  return {
    orm,
    serverPort,
    cleanup,
  };
};

/**
 * Create a ts-rest client for a TestApp.
 */
export const createTestClient = (app: TestApp) => {
  return initClient(contract, {
    baseUrl: `http://localhost:${app.serverPort}`,
  });
};
