import "dotenv/config";
import "reflect-metadata";

import { MikroORM } from "@mikro-orm/postgresql";
import { createApp } from "./app.js";
import { env } from "./env.js";
import config from "./mikro-orm.config.js";
import cors from "cors";




const start = async () => {
  // create orm
  const orm = await MikroORM.init(config);

  // update schema to latest (potentially destructive)
  // TODO
  await orm.schema.updateSchema();

  // create app
  const app = createApp(orm);


  app.use(cors({
    origin: "http://3.147.55.38:5173", // or your production domain
    credentials: true,
  }));
  
  // listen
  const port = env.PORT ?? 5174;
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
};

start();
