import "dotenv/config";

import { defineConfig } from "@mikro-orm/postgresql";
import { env } from "./env.js";

export default defineConfig({
  entities: [],
  dbName: "project",
  dynamicImportProvider: (id) => import(id),

  clientUrl: env.DATABASE_URL,

  debug: true,
});
