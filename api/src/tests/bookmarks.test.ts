import type { EntityManager } from "@mikro-orm/postgresql";
import { afterEach, assert, beforeEach, describe, expect, test } from "vitest";
import {
  makeAuthedClient,
  makeExampleArticle,
  startTestApp,
  type TestApp,
} from "./utils.js";
import { Bookmark } from "../entities/Bookmark.js";

describe("/articles/:id/bookmark", () => {
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

  test("creates a Bookmark row when bookmarking", async () => {
    const article = makeExampleArticle(1, "technology");
    await em.persistAndFlush(article);

    const client = await makeAuthedClient(app);

    // should be 0 bookmark rows
    expect(await em.count(Bookmark)).toBe(0);

    // bookmark
    const res1 = await client.bookmarkArticle({
      params: {
        id: article.id,
      },
      body: {
        bookmarked: true,
      },
    });
    assert(res1.status === 200, "should succeed");

    // should be 1 bookmark row
    expect(await em.count(Bookmark)).toBe(1);
  });

  test("deletes Bookmark row when unbookmarking", async () => {
    const article = makeExampleArticle(1, "technology");
    await em.persistAndFlush(article);

    const client = await makeAuthedClient(app);

    // should be 0 bookmark rows
    expect(await em.count(Bookmark)).toBe(0);

    // bookmark
    const res1 = await client.bookmarkArticle({
      params: {
        id: article.id,
      },
      body: {
        bookmarked: true,
      },
    });
    assert(res1.status === 200, "should succeed");

    // should be 1 bookmark row
    expect(await em.count(Bookmark)).toBe(1);

    // unbookmark
    const res2 = await client.bookmarkArticle({
      params: {
        id: article.id,
      },
      body: {
        bookmarked: false,
      },
    });
    assert(res2.status === 200, "should succeed");

    // should be 0 bookmark rows
    expect(await em.count(Bookmark)).toBe(0);
  });

  test("returns status", async () => {
    const article = makeExampleArticle(1, "technology");
    await em.persistAndFlush(article);

    const client = await makeAuthedClient(app);

    // should be unbookmarked
    const res1 = await client.getArticles({});
    assert(res1.status === 200, "should succeed");
    expect(res1.body.articles.length).toBe(1);
    expect(res1.body.articles[0]!.id).toBe(article.id);
    expect(res1.body.articles[0]!.bookmarked).toBe(false);

    // should return new status
    const res2 = await client.bookmarkArticle({
      params: {
        id: article.id,
      },
      body: {
        bookmarked: true,
      },
    });
    assert(res2.status === 200, "should succeed");
    expect(res2.body.id).toBe(article.id);
    expect(res2.body.bookmarked).toBe(true);

    // get list, should be bookmarked
    const res3 = await client.getArticles({});
    assert(res3.status === 200, "should succeed");
    expect(res3.body.articles.length).toBe(1);
    expect(res3.body.articles[0]!.id).toBe(article.id);
    expect(res3.body.articles[0]!.bookmarked).toBe(true);

    // unbookmark again
    const res4 = await client.bookmarkArticle({
      params: {
        id: article.id,
      },
      body: {
        bookmarked: false,
      },
    });
    assert(res4.status === 200, "should succeed");
    expect(res4.body.id).toBe(article.id);
    expect(res4.body.bookmarked).toBe(false);

    // get list, should be unbookmarked
    const res5 = await client.getArticles({});
    assert(res5.status === 200, "should succeed");
    expect(res5.body.articles.length).toBe(1);
    expect(res5.body.articles[0]!.id).toBe(article.id);
    expect(res5.body.articles[0]!.bookmarked).toBe(false);
  });
});

describe("/articles/bookmarked", () => {
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

  test("lists bookmarks", async () => {
    const article = makeExampleArticle(1, "technology");
    await em.persistAndFlush(article);

    const client = await makeAuthedClient(app);

    // bookmarks should be empty
    const res1 = await client.getBookmarkedArticles({});
    assert(res1.status === 200, "should succeed");
    expect(res1.body.articles.length).toBe(0);

    // bookmark
    const res2 = await client.bookmarkArticle({
      params: {
        id: article.id,
      },
      body: {
        bookmarked: true,
      },
    });
    assert(res2.status === 200, "should succeed");

    // bookmarks should contain bookmark
    const res3 = await client.getBookmarkedArticles({});
    assert(res3.status === 200, "should succeed");
    expect(res3.body.articles.length).toBe(1);
    expect(res3.body.articles[0]!.id).toBe(article.id);
    expect(res3.body.articles[0]!.bookmarked).toBe(true);

    // unbookmark
    const res4 = await client.bookmarkArticle({
      params: {
        id: article.id,
      },
      body: {
        bookmarked: false,
      },
    });
    assert(res4.status === 200, "should succeed");

    // bookmarks should be empty again
    const res5 = await client.getBookmarkedArticles({});
    assert(res5.status === 200, "should succeed");
    expect(res5.body.articles.length).toBe(0);
  });
});
