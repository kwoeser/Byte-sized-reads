import "dotenv/config";
import "reflect-metadata";

import { MikroORM } from "@mikro-orm/postgresql";
import { createApp } from "./app.js";
import { env } from "./env.js";
import config from "./mikro-orm.config.js";

const start = async () => {
  // create orm
  const orm = await MikroORM.init(config);

  // update schema to latest (potentially destructive)
  // TODO
  await orm.schema.updateSchema();

  // create app
  const app = createApp(orm);

  // listen
  const port = env.PORT ?? 5174;
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
};

start();
