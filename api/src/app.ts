import { MikroORM, RequestContext } from "@mikro-orm/postgresql";
import { createExpressEndpoints } from "@ts-rest/express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { contract } from "./apiContract.js";
import { createRouter } from "./router.js";

/**
 * Creates an express app.
 */
export const createApp = (orm: MikroORM) => {
  const app = express();

  // configure CORS middleware
  // TODO
  const corsConfig = {
    origin: "*",
  };
  app.use(cors(corsConfig));

  // parsing middlewares
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  // orm request context middleware
  // automatically forks the EntityManager for each request
  app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
  });

  // set up ts-rest router
  const router = createRouter(orm);
  createExpressEndpoints(contract, router, app, {
    logInitialization: false,
  });

  return app;
};
