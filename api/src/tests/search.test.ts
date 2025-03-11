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

  test("searches by title", async () => {
    const article1 = makeExampleArticle(1, "technology");
    article1.title = "asdasdasdFOOasdasdasd";
    const article2 = makeExampleArticle(2, "technology");
    article2.title = "asdasdasdBARasdasdasd";
    await em.persistAndFlush([article1, article2]);

    const client = await makeAuthedClient(app);

    // get with no filters
    const res1 = await client.getArticles({});
    assert(res1.status === 200, "should succeed");
    expect(res1.body.articles.length).toBe(2);

    // get with search
    const res2 = await client.getArticles({ query: { search: "foo" } });
    assert(res2.status === 200, "should succeed");
    expect(res2.body.articles.length).toBe(1);
    expect(res2.body.articles[0]!.id).toBe(article1.id);
    const res3 = await client.getArticles({ query: { search: "bar" } });
    assert(res3.status === 200, "should succeed");
    expect(res3.body.articles.length).toBe(1);
    expect(res3.body.articles[0]!.id).toBe(article2.id);
    const res4 = await client.getArticles({ query: { search: "a" } });
    assert(res4.status === 200, "should succeed");
    expect(res4.body.articles.length).toBe(2);
  });
});
