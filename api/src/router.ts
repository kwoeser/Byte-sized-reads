import type { MikroORM } from "@mikro-orm/postgresql";
import { initServer } from "@ts-rest/express";
import { contract } from "./apiContract.js";
import { login, logout, register, validateSession } from "./auth.js";
import { Article } from "./entities/Article.js";
import { ModerationStatus, Submission } from "./entities/Submission.js";

export const createRouter = (orm: MikroORM) => {
  const s = initServer();

  return s.router(contract, {
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
            moderator: registerRes.ok.moderator,
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
            moderator: loginRes.ok.moderator,
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
        body: { id: user.id, username: user.username, moderator: user.moderator },
      };
    },

    getArticles: async ({ req, res }) => {
      const prevCursor = req.query.cursor ?? undefined;
      const articles = await orm.em.findByCursor(
        Article,
        {},
        {
          first: 10,
          after: prevCursor,
          // mikroORM needs a specific orderBy otherwise theres a error on backend  
          orderBy: { createdAt: 'DESC' }  
        }
      );

      return {
        status: 200,
        body: {
          articles: articles.items.map((a) => ({
            id: a.id,
            url: a.url,
            siteName: a.siteName,
            title: a.title,
            excerpt: a.excerpt,
            wordCount: a.wordCount,
          })),
          cursor: articles.endCursor,
        },
      };
    },

    submitArticle: async ({ req, res }) => {
      // check for existing
      const existing = await orm.em.findOne(Submission, { url: req.body.url });
      if (existing) {
        return {
          status: 200,
          body: {
            id: existing.id,
            url: existing.url,
            moderationStatus: existing.moderationStatus ?? null,
          },
        };
      }

      const submission = new Submission(req.body.url);
      await orm.em.persistAndFlush(submission);

      return {
        status: 200,
        body: {
          id: submission.id,
          url: submission.url,
          moderationStatus: submission.moderationStatus ?? null,
        },
      };
    },

    getSubmissions: async ({ req, res }) => {
      const session = await validateSession(orm.em, req, res);

      if (!session) {
        return { status: 401, body: "Unauthorized" };
      }
      
      const user = session.user.$;
      
      // Check if the user is a moderator
      if (!user.moderator) {
        return { status: 403, body: "Forbidden" };
      }
      

      const prevCursor = req.query.cursor ?? undefined;
      const submissions = await orm.em.findByCursor(
        Submission,
        {},
        {
          first: 10,
          after: prevCursor,
          orderBy: { createdAt: "DESC" },
        }
      );

      return {
        status: 200,
        body: {
          submissions: submissions.items.map((s) => ({
            id: s.id,
            url: s.url,
            moderationStatus: s.moderationStatus ?? null,
          })),
          cursor: submissions.endCursor,
        },
      };
    },

    moderateSubmission: async ({ req, res }) => {
      const session = await validateSession(orm.em, req, res);
      if (!session) {
        return { status: 401, body: "Unauthorized" };
      }
      const user = session.user.$;
    
      // Check if the user is a moderator
      if (!user.moderator) {
        return { status: 403, body: "Forbidden" }; 
      }

      if (!req.body.status || !["approved", "rejected"].includes(req.body.status)) {
        return {
          status: 400,
          body: "Invalid status. Must be 'approved' or 'rejected'",
        };
      }

      const submission = await orm.em.findOne(Submission, {
        id: req.params.id,
      });
      if (!submission) {
        return {
          status: 404,
          body: "Not Found",
        };
      }

      if (req.body.status === "approved") {
        submission.moderationStatus = ModerationStatus.APPROVED;
      } else if (req.body.status === "rejected") {
        submission.moderationStatus = ModerationStatus.REJECTED;
      }
      await orm.em.flush();

      return {
        status: 200,
        body: {
          id: submission.id,
          url: submission.url,
          moderationStatus: submission.moderationStatus ?? null,
        },
      };
    },
  });
};
