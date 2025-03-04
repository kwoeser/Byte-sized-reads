import type { EntityManager } from "@mikro-orm/postgresql";
import { afterEach, assert, beforeEach, describe, expect, test } from "vitest";
import { Submission } from "../entities/Submission.js";
import { createTestClient, startTestApp, type TestApp } from "./utils.js";

describe("/articles/submit", () => {
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

  test("creates a Submission row", async () => {
    const client = createTestClient(app);

    // should be 0 user rows
    expect(await em.count(Submission)).toBe(0);

    // submit
    const res = await client.submitArticle({
      body: {
        url: "https://example.com/posts/1",
      },
    });
    // should succeed
    assert(res.status === 200, "should respond with 200");

    // should be 1 user row
    expect(await em.count(Submission)).toBe(1);
  });
  test("returns the submission", async () => {
    const client = createTestClient(app);

    // submit
    const res = await client.submitArticle({
      body: {
        url: "https://example.com/posts/1",
      },
    });
    // should succeed
    assert(res.status === 200, "should respond with 200");

    // should return the user
    expect(res.body).toEqual(
      expect.objectContaining({
        url: "https://example.com/posts/1",
        moderationStatus: "none",
      })
    );
  });

  test.for([
    ["url is missing", {}],
    ["url is invalid", { url: "asdf" }],
  ])("fails when %s", async ([desc, req]) => {
    const client = createTestClient(app);

    // submit
    const res = await client.submitArticle({
      body: req as any,
    });
    // should fail
    expect(res.status).toBe(400);

    // should be 0 submission rows
    expect(await em.count(Submission)).toBe(0);
  });

  test("returns existing submission when already submitted", async () => {
    const client = createTestClient(app);

    // submit
    const res1 = await client.submitArticle({
      body: { url: "https://example.com/posts/1" },
    });
    // should succeed
    assert(res1.status === 200, "should respond with 200");

    // submit
    const res2 = await client.submitArticle({
      body: { url: "https://example.com/posts/1" },
    });
    // should succeed
    assert(res2.status === 200, "should respond with 200");

    // should return the same id
    expect(res2.body.id).toBe(res1.body.id);

    // should be only 1 submission row
    expect(await em.count(Submission)).toBe(1);
  });
});

describe("/submissions", () => {
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

  test("returns submissions", async () => {
    const client = createTestClient(app);

    // submit some articles
    const res1 = await client.submitArticle({
      body: {
        url: "https://example.com/posts/1",
      },
    });
    assert(res1.status === 200, "should respond with 200");
    const res2 = await client.submitArticle({
      body: {
        url: "https://example.com/posts/2",
      },
    });
    assert(res2.status === 200, "should respond with 200");
    const res3 = await client.submitArticle({
      body: {
        url: "https://example.com/posts/3",
      },
    });
    assert(res3.status === 200, "should respond with 200");

    // should be 3 submissions
    expect(await em.count(Submission)).toBe(3);

    // get submissions
    const res4 = await client.getSubmissions();
    assert(res4.status === 200, "should respond with 200");

    // should have 3 submissions in response
    expect(res4.body.submissions.length).toBe(3);

    // should be most recent first
    expect(res4.body.submissions[0]!.id).toBe(res3.body.id);
    expect(res4.body.submissions[1]!.id).toBe(res2.body.id);
    expect(res4.body.submissions[2]!.id).toBe(res1.body.id);
  });

  // TODO: should only be available to moderators
  // TODO: should be able to filter for unmoderated only
});

describe("/submissions/:id/moderate", () => {
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

  test.for([
    ["approving", { status: "approved" }],
    ["rejecting", { status: "rejected" }],
  ])("returns new status when %s", async ([desc, req]) => {
    const client = createTestClient(app);

    // submit an article
    const res1 = await client.submitArticle({
      body: {
        url: "https://example.com/posts/1",
      },
    });
    assert(res1.status === 200, "should respond with 200");

    // approve
    const res2 = await client.moderateSubmission({
      params: {
        id: res1.body.id,
      },
      body: req as any,
    });
    assert(res2.status === 200, "should respond with 200");

    // should return new status
    expect(res2.body.moderationStatus).toBe((req as any).status);
  });

  test.for([
    ["status is missing", {}],
    ["status is invalid", { status: "asdf" }],
    ["status is none", { status: "none" }],
  ])("fails when %s", async ([desc, req]) => {
    const client = createTestClient(app);

    // submit an article
    const res1 = await client.submitArticle({
      body: {
        url: "https://example.com/posts/1",
      },
    });
    assert(res1.status === 200, "should respond with 200");

    // approve
    const res2 = await client.moderateSubmission({
      params: {
        id: res1.body.id,
      },
      body: req as any,
    });
    // should fail
    expect(res2.status).toBe(400);
  });

  // TODO: should only be available to moderators
});
