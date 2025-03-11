import type { EntityManager } from "@mikro-orm/postgresql";
import { afterEach, assert, beforeEach, describe, expect, test } from "vitest";
import {
  makeAuthedClient,
  makeExampleArticle,
  startTestApp,
  type TestApp,
} from "./utils.js";
import { ReadStatus } from "../entities/ReadStatus.js";

describe("/articles/:id/read", () => {
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

  test("creates a ReadStatus row when marking read", async () => {
    const article = makeExampleArticle(1, "technology");
    await em.persistAndFlush(article);

    const client = await makeAuthedClient(app);

    // should be 0 read status rows
    expect(await em.count(ReadStatus)).toBe(0);

    // mark read
    const res1 = await client.readArticle({
      params: {
        id: article.id,
      },
      body: {
        read: true,
      },
    });
    assert(res1.status === 200, "should succeed");

    // should be 1 read status row
    expect(await em.count(ReadStatus)).toBe(1);
  });

  test("deletes ReadStatus row when marking unread", async () => {
    const article = makeExampleArticle(1, "technology");
    await em.persistAndFlush(article);

    const client = await makeAuthedClient(app);

    // should be 0 read status rows
    expect(await em.count(ReadStatus)).toBe(0);

    // mark read
    const res1 = await client.readArticle({
      params: {
        id: article.id,
      },
      body: {
        read: true,
      },
    });
    assert(res1.status === 200, "should succeed");

    // should be 1 read status row
    expect(await em.count(ReadStatus)).toBe(1);

    // mark unread
    const res2 = await client.readArticle({
      params: {
        id: article.id,
      },
      body: {
        read: false,
      },
    });
    assert(res2.status === 200, "should succeed");

    // should be 0 read status rows
    expect(await em.count(ReadStatus)).toBe(0);
  });

  test("returns status", async () => {
    const article = makeExampleArticle(1, "technology");
    await em.persistAndFlush(article);

    const client = await makeAuthedClient(app);

    // should be unread
    const res1 = await client.getArticles({});
    assert(res1.status === 200, "should succeed");
    expect(res1.body.articles.length).toBe(1);
    expect(res1.body.articles[0]!.id).toBe(article.id);
    expect(res1.body.articles[0]!.read).toBe(false);

    // should return new status
    const res2 = await client.readArticle({
      params: {
        id: article.id,
      },
      body: {
        read: true,
      },
    });
    assert(res2.status === 200, "should succeed");
    expect(res2.body.id).toBe(article.id);
    expect(res2.body.read).toBe(true);

    // get list, should be read
    const res3 = await client.getArticles({});
    assert(res3.status === 200, "should succeed");
    expect(res3.body.articles.length).toBe(1);
    expect(res3.body.articles[0]!.id).toBe(article.id);
    expect(res3.body.articles[0]!.read).toBe(true);

    // mark unread again
    const res4 = await client.readArticle({
      params: {
        id: article.id,
      },
      body: {
        read: false,
      },
    });
    assert(res4.status === 200, "should succeed");
    expect(res4.body.id).toBe(article.id);
    expect(res4.body.read).toBe(false);

    // get list, should be unread
    const res5 = await client.getArticles({});
    assert(res5.status === 200, "should succeed");
    expect(res5.body.articles.length).toBe(1);
    expect(res5.body.articles[0]!.id).toBe(article.id);
    expect(res5.body.articles[0]!.read).toBe(false);
  });
});

describe("/articles/read", () => {
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

  test("lists read articles", async () => {
    const article = makeExampleArticle(1, "technology");
    await em.persistAndFlush(article);

    const client = await makeAuthedClient(app);

    // read list should be empty
    const res1 = await client.getReadArticles({});
    assert(res1.status === 200, "should succeed");
    expect(res1.body.articles.length).toBe(0);

    // mark read
    const res2 = await client.readArticle({
      params: {
        id: article.id,
      },
      body: {
        read: true,
      },
    });
    assert(res2.status === 200, "should succeed");

    // read list should contain read article
    const res3 = await client.getReadArticles({});
    assert(res3.status === 200, "should succeed");
    expect(res3.body.articles.length).toBe(1);
    expect(res3.body.articles[0]!.id).toBe(article.id);
    expect(res3.body.articles[0]!.read).toBe(true);

    // mark unread
    const res4 = await client.readArticle({
      params: {
        id: article.id,
      },
      body: {
        read: false,
      },
    });
    assert(res4.status === 200, "should succeed");

    // read list should be empty again
    const res5 = await client.getReadArticles({});
    assert(res5.status === 200, "should succeed");
    expect(res5.body.articles.length).toBe(0);
  });
});

describe("/articles", () => {
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

  test("hides read articles when requested", async () => {
    const article = makeExampleArticle(1, "technology");
    await em.persistAndFlush(article);

    const client = await makeAuthedClient(app);

    // get articles with no filters
    const res1 = await client.getArticles({});
    assert(res1.status === 200, "should succeed");
    expect(res1.body.articles.length).toBe(1);
    // get articles, hiding read. should sitll be returned
    const res2 = await client.getArticles({ query: { hideRead: "true" } });
    assert(res2.status === 200, "should succeed");
    expect(res2.body.articles.length).toBe(1);

    // mark read
    const res3 = await client.readArticle({
      params: {
        id: article.id,
      },
      body: {
        read: true,
      },
    });
    assert(res3.status === 200, "should succeed");

    // get articles with no filters
    const res4 = await client.getArticles({});
    assert(res4.status === 200, "should succeed");
    expect(res4.body.articles.length).toBe(1);
    // get articles, hiding read. should not be returned
    const res5 = await client.getArticles({ query: { hideRead: "true" } });
    assert(res5.status === 200, "should succeed");
    expect(res5.body.articles.length).toBe(0);
  });
});
