import "dotenv/config";
import "reflect-metadata";

import { RequestContext } from "@mikro-orm/postgresql";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { contract } from "./apiContract.js";
import { login, logout, register, validateSession } from "./auth.js";
import { env } from "./env.js";
import { orm } from "./orm.js";

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

  register: async ({ req, res }) => {
    const registerRes = await register(
      orm.em,
      req.body.username,
      req.body.password,
      res
    );
    if ("error" in registerRes) {
      return {
        status: 401,
        body: registerRes.error,
      };
    } else {
      return {
        status: 200,
        body: {
          id: registerRes.ok.id,
          username: registerRes.ok.username,
        },
      };
    }
  },
  login: async ({ req, res }) => {
    const loginRes = await login(
      orm.em,
      req.body.username,
      req.body.password,
      res
    );
    if ("error" in loginRes) {
      return {
        status: 401,
        body: loginRes.error,
      };
    } else {
      return {
        status: 200,
        body: {
          id: loginRes.ok.id,
          username: loginRes.ok.username,
        },
      };
    }
  },
  logout: async ({ req, res }) => {
    await logout(orm.em, req, res);
    return {
      status: 200,
      body: "Logged out",
    };
  },

  getUser: async ({ req, res }) => {
    const session = await validateSession(orm.em, req, res);
    if (!session) {
      return { status: 401, body: "Unauthorized" };
    }
    const user = session.user.$;

    return {
      status: 200,
      body: { id: user.id, username: user.username },
    };
  },
});

createExpressEndpoints(contract, router, app);

const port = env.PORT ?? 5174;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
