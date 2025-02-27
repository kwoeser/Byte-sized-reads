import { afterEach, assert, beforeEach, expect, test } from "vitest";
import { createTestClient, startTestApp, type TestApp } from "./utils.js";

let app: TestApp;

beforeEach(async () => {
  app = await startTestApp();
});
afterEach(async () => {
  await app.cleanup();
});

test("/hello", async () => {
  const client = createTestClient(app);

  const res = await client.hello();
  assert(res.status === 200);
  expect(res.body).toBe("hello world");
});
