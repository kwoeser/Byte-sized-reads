import type { EntityManager } from "@mikro-orm/postgresql";
import { afterEach, assert, beforeEach, describe, expect, test } from "vitest";
import {
  makeAuthedClient,
  makeExampleArticle,
  makeExampleArticles,
  startTestApp,
  type TestApp,
} from "./utils.js";

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

  test("returns articles", async () => {
    const articles = makeExampleArticles(5, "technology");
    await em.persistAndFlush(articles);

    const client = await makeAuthedClient(app);

    const res1 = await client.getArticles({});
    assert(res1.status === 200, "should succeed");
    expect(res1.body.articles.length).toBe(5);
  });

  test("filters by category", async () => {
    const techArticle = makeExampleArticle(1, "technology");
    const travelArticle = makeExampleArticle(1, "travel");
    await em.persistAndFlush([techArticle, travelArticle]);

    const client = await makeAuthedClient(app);

    const res1 = await client.getArticles({});
    assert(res1.status === 200, "should succeed");
    expect(res1.body.articles.length).toBe(2);

    const res2 = await client.getArticles({
      query: { category: "technology" },
    });
    assert(res2.status === 200, "should succeed");
    expect(res2.body.articles.length).toBe(1);
    expect(res2.body.articles[0]!.id).toBe(techArticle.id);

    const res3 = await client.getArticles({
      query: { category: "travel" },
    });
    assert(res3.status === 200, "should succeed");
    expect(res3.body.articles.length).toBe(1);
    expect(res3.body.articles[0]!.id).toBe(travelArticle.id);

    const res4 = await client.getArticles({
      query: { category: "video games" },
    });
    assert(res4.status === 200, "should succeed");
    expect(res4.body.articles.length).toBe(0);
  });

  test("filters by length", async () => {
    const shortArticle = makeExampleArticle(1, "technology");
    shortArticle.wordCount = 200;
    const longArticle = makeExampleArticle(2, "technology");
    longArticle.wordCount = 7000;
    await em.persistAndFlush([shortArticle, longArticle]);

    const client = await makeAuthedClient(app);

    const res1 = await client.getArticles({});
    assert(res1.status === 200, "should succeed");
    expect(res1.body.articles.length).toBe(2);

    const res2 = await client.getArticles({
      query: { length: "short" },
    });
    assert(res2.status === 200, "should succeed");
    expect(res2.body.articles.length).toBe(1);
    expect(res2.body.articles[0]!.id).toBe(shortArticle.id);

    const res3 = await client.getArticles({
      query: { length: "long" },
    });
    assert(res3.status === 200, "should succeed");
    expect(res3.body.articles.length).toBe(1);
    expect(res3.body.articles[0]!.id).toBe(longArticle.id);
  });
});
