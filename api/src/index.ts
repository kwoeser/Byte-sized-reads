import "dotenv/config";
import "reflect-metadata";

import { RequestContext } from "@mikro-orm/postgresql";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./env.js";
import { orm } from "./orm.js";
import { contract } from "./apiContract.js";

const app = express();

// TODO
const corsConfig = {
  origin: "*",
};
app.use(cors(corsConfig));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

const s = initServer();

const router = s.router(contract, {
  hello: async ({ req, res }) => {
    return {
      status: 200,
      body: "hello world",
    };
  },
});

createExpressEndpoints(contract, router, app);

const port = env.PORT ?? 5174;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
