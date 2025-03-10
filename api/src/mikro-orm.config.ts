import "dotenv/config";

import { type Options } from "@mikro-orm/core";
import { defineConfig, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Article } from "./entities/Article.js";
import { Bookmark } from "./entities/Bookmark.js";
import { ReadStatus } from "./entities/ReadStatus.js";
import { Session } from "./entities/Session.js";
import { Submission } from "./entities/Submission.js";
import { User } from "./entities/User.js";
import { env } from "./env.js";

/**
 * Options common to all ORM configs.
 */
const baseOptions: Options<PostgreSqlDriver> = {
  entities: [
    Article,
    Bookmark,
    ReadStatus,
    Session,
    Submission,
    User,
    //
  ],
  dynamicImportProvider: (id) => import(id),
};

/**
 * Default ORM config for runtime and mikro-orm cli.
 */
export default defineConfig({
  ...baseOptions,

  clientUrl: env.DATABASE_URL,
  dbName: "project",

  debug: true,
});

/**
 * ORM config for tests.
 */
export const testOrmConfig = defineConfig({
  ...baseOptions,
});
