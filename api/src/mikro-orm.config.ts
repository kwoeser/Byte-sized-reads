import "dotenv/config";

import { type Options } from "@mikro-orm/core";
import { defineConfig, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Session } from "./entities/Session.js";
import { User } from "./entities/User.js";
import { env } from "./env.js";

/**
 * Options common to all ORM configs.
 */
const baseOptions: Options<PostgreSqlDriver> = {
  entities: [
    User,
    Session,
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
