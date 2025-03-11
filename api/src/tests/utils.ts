import "reflect-metadata";

import type { MikroORM } from "@mikro-orm/postgresql";
import { initClient } from "@ts-rest/core";
import { newDb } from "pg-mem";
import { assert } from "vitest";
import { contract } from "../apiContract.js";
import { createApp } from "../app.js";
import { SESSION_COOKIE_NAME } from "../auth.js";
import { Article } from "../entities/Article.js";
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
 * Options for creating a test API client.
 */
export type TestClientOptions = {
  sessionCookie?: string;
};

/**
 * Create a ts-rest client for a TestApp.
 *
 * Optionally takes TestClientOptions to set the session cookie for requests.
 */
export const createTestClient = (
  app: TestApp,
  options: TestClientOptions = {}
) => {
  const baseHeaders: Record<string, string> = {};

  if (options.sessionCookie) {
    baseHeaders["Cookie"] = SESSION_COOKIE_NAME + "=" + options.sessionCookie;
  }

  return initClient(contract, {
    baseUrl: `http://localhost:${app.serverPort}`,
    baseHeaders,
  });
};

/**
 * Parses an array of Set-Cookie headers to find the session cookie.
 */
export const parseSetSessionCookie = (setCookie: string[]) => {
  const setSessionCookie = setCookie.find((c) =>
    c.startsWith(SESSION_COOKIE_NAME + "=")
  );
  assert(setSessionCookie);

  const match = setSessionCookie.match(/^[^=]*=([^;]*)/);
  assert(match);

  return match[1];
};

/**
 * Creates an Article object for testing.
 */
export const makeExampleArticle = (n: number, category: string) => {
  return new Article(
    "https://example.com/posts/" + category + "/" + n,
    "example.com",
    "Post " + n,
    "",
    1234,
    category
  );
};
/**
 * Creates multiple Article objects for testing.
 */
export const makeExampleArticles = (n: number, category: string) => {
  const articles = [];
  for (let i = 1; i <= n; i++) {
    articles.push(makeExampleArticle(i, category));
  }
  return articles;
};

/**
 * Registers an account and returns a ts-rest client with auth configured.
 *
 * Optionally takes a username.
 */
export const makeAuthedClient = async (app: TestApp, username = "test") => {
  const client = createTestClient(app);
  const registerRes = await client.register({
    body: {
      username: username,
      password: "testtest",
    },
  });
  const setCookie = registerRes.headers.getSetCookie();
  const sessionCookie = parseSetSessionCookie(setCookie);
  const authedClient = createTestClient(app, { sessionCookie });
  return authedClient;
};
