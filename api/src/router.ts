import type { MikroORM } from "@mikro-orm/postgresql";
import { contract } from "./apiContract.js";
import { login, logout, register, validateSession } from "./auth.js";
import { initServer } from "@ts-rest/express";

export const createRouter = (orm: MikroORM) => {
  const s = initServer();

  return s.router(contract, {
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
          status: 400,
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
};
