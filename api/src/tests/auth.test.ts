import { afterEach, assert, beforeEach, describe, expect, test } from "vitest";
import {
  createTestClient,
  parseSetSessionCookie,
  startTestApp,
  type TestApp,
} from "./utils.js";
import { User } from "../entities/User.js";
import type { EntityManager } from "@mikro-orm/postgresql";

describe("/auth/register", () => {
  // create an instance of the api and database for each test
  let app: TestApp;
  let em: EntityManager;
  beforeEach(async () => {
    app = await startTestApp();
    em = app.orm.em.fork();
  });
  afterEach(async () => {
    await app.cleanup();
  });

  test("creates a User row", async () => {
    const client = createTestClient(app);

    // should be 0 user rows
    expect(await em.count(User)).toBe(0);

    // register
    const res = await client.register({
      body: {
        username: "testuser",
        password: "aaaaaaaa",
      },
    });
    // should succeed
    assert(res.status === 200, "should respond with 200");

    // should be 1 user row
    expect(await em.count(User)).toBe(1);
  });
  test("returns the user", async () => {
    const client = createTestClient(app);

    // register
    const res = await client.register({
      body: {
        username: "testuser",
        password: "aaaaaaaa",
      },
    });
    // should succeed
    assert(res.status === 200, "should respond with 200");

    // should return the user
    expect(res.body).toEqual(
      expect.objectContaining({
        username: "testuser",
      })
    );
  });
  test("returns a session", async () => {
    // create an api client with no auth
    const unauthedClient = createTestClient(app);

    // register
    const res1 = await unauthedClient.register({
      body: { username: "testuser", password: "aaaaaaaa" },
    });
    // should succeed
    expect(res1.status).toBe(200);

    // should set cookie
    const setCookie = res1.headers.getSetCookie();
    expect(setCookie.length).toBe(1);
    expect(setCookie[0]).toMatch(/session=(.*);/);

    // parse the session cookie and create an authed client
    const sessionCookie = parseSetSessionCookie(res1.headers.getSetCookie());
    const authedClient = createTestClient(app, {
      sessionCookie,
    });

    // get user with authed client
    const res2 = await authedClient.getUser();
    // should succeed
    assert(res2.status === 200, "should respond with 200");

    // should return the user
    expect(res2.body).toEqual(
      expect.objectContaining({
        username: "testuser",
      })
    );
  });

  test.for([
    ["request is empty", {}],
    ["username is missing", { password: "aaaaaaaa" }],
    ["password is missing", { username: "testuser" }],
    ["username is empty", { username: "", password: "aaaaaaaa" }],
    ["password is empty", { username: "testuser", password: "" }],
    ["password is too short", { username: "testuser", password: "aaaa" }],
  ])("fails when %s", async ([desc, req]) => {
    const client = createTestClient(app);

    // register
    const res = await client.register({
      body: req as any,
    });
    // should fail
    expect(res.status).toBe(400);

    // should be 0 user rows
    expect(await em.count(User)).toBe(0);
  });

  test("fails when username is taken", async () => {
    const client = createTestClient(app);

    // register
    const res1 = await client.register({
      body: { username: "testuser", password: "aaaaaaaa" },
    });
    // should succeed
    expect(res1.status).toBe(200);

    // register again with the same username
    const res2 = await client.register({
      body: { username: "testuser", password: "bbbbbbbb" },
    });
    // should fail
    expect(res2.status).toBe(400);

    // should be only 1 user row
    expect(await em.count(User)).toBe(1);
  });
});

// TODO: tests for login, logout, getuser when unauthed
