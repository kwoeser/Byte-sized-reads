import "dotenv/config";

import { defineConfig } from "@mikro-orm/postgresql";
import { Session } from "./entities/Session.js";
import { User } from "./entities/User.js";
import { env } from "./env.js";

export default defineConfig({
  entities: [
    User,
    Session,
    //
  ],
  dbName: "project",
  dynamicImportProvider: (id) => import(id),

  clientUrl: env.DATABASE_URL,

  debug: true,
});
