import type { MikroORM } from "@mikro-orm/postgresql";
import { initServer } from "@ts-rest/express";
import { contract } from "./apiContract.js";
import { login, logout, register, validateSession } from "./auth.js";
import { Article } from "./entities/Article.js";
import { ModerationStatus, Submission } from "./entities/Submission.js";
import { ReadStatus } from "./entities/ReadStatus.js";
import { Bookmark } from "./entities/Bookmark.js";

const ARTICLES_PER_PAGE = 100;

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
        body: {
          id: user.id,
          username: user.username,
          moderator: user.moderator,
        },
      };
    },

    getArticles: async ({ req, res }) => {
      // try to get the user
      const session = await validateSession(orm.em, req, res);
      const user = session?.user?.$;

      // get articles
      const prevCursor = req.query.cursor ?? undefined;
      const articles = await orm.em.findByCursor(
        Article,
        {},
        {
          first: ARTICLES_PER_PAGE,
          after: prevCursor,
          orderBy: { createdAt: "DESC" },
        }
      );

      // if authed, get read statuses for these articles
      let readStatusSet = new Set();
      if (user) {
        const readStatusRows = await orm.em.findAll(ReadStatus, {
          where: {
            user,
            article: { $in: articles.items.map((a) => a.id) },
          },
        });
        readStatusSet = new Set(readStatusRows.map((r) => r.id));
      }

      // if authed, get read statuses for these articles
      let bookmarkSet = new Set();
      if (user) {
        const bookmarkRows = await orm.em.findAll(Bookmark, {
          where: {
            user,
            article: { $in: articles.items.map((a) => a.id) },
          },
        });
        bookmarkSet = new Set(bookmarkRows.map((r) => r.id));
      }

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

            read: readStatusSet.has(a.id),
            bookmarked: bookmarkSet.has(a.id),
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
          first: ARTICLES_PER_PAGE,
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

      if (
        !req.body.status ||
        !["approved", "rejected"].includes(req.body.status)
      ) {
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

    readArticle: async ({ req, res }) => {
      // get user
      const session = await validateSession(orm.em, req, res);
      if (!session) {
        return { status: 401, body: "Unauthorized" };
      }
      const user = session.user.$;

      // get article
      const article = await orm.em.findOne(Article, {
        id: req.params.id,
      });
      if (!article) {
        return {
          status: 404,
          body: "Not Found",
        };
      }

      let read;

      // check if marking as read or unread
      if (req.body.read) {
        // mark as read

        // check for existing
        read = (await orm.em.count(ReadStatus, { user, article })) > 0;

        // if not read, create ReadStatus row
        if (!read) {
          const readStatus = new ReadStatus(user, article);
          await orm.em.persistAndFlush(readStatus);
          read = true;
        }
      } else {
        // mark as unread
        read = false;

        // delete any ReadStatus rows if they exist
        await orm.em.nativeDelete(ReadStatus, { user, article });
      }

      // check if bookmarked for response
      const bookmarked = (await orm.em.count(Bookmark, { user, article })) > 0;

      return {
        status: 200,
        body: {
          id: article.id,
          url: article.url,
          siteName: article.siteName,
          title: article.title,
          excerpt: article.excerpt,
          wordCount: article.wordCount,

          read,
          bookmarked,
        },
      };
    },

    getReadArticles: async ({ req, res }) => {
      // get user
      const session = await validateSession(orm.em, req, res);
      if (!session) {
        return { status: 401, body: "Unauthorized" };
      }
      const user = session.user.$;

      // get ReadStatuses and prefetch (join) articles
      const prevCursor = req.query.cursor ?? undefined;
      const readStatuses = await orm.em.findByCursor(
        ReadStatus,
        {
          user,
        },
        {
          first: ARTICLES_PER_PAGE,
          after: prevCursor,
          orderBy: { createdAt: "DESC" },
          populate: ["article"],
        }
      );

      // get bookmarks for read articles for response
      const bookmarkRows = await orm.em.findAll(Bookmark, {
        where: {
          user,
          article: { $in: readStatuses.items.map((r) => r.article.$.id) },
        },
      });
      const bookmarkSet = new Set(bookmarkRows.map((b) => b.id));

      return {
        status: 200,
        body: {
          articles: readStatuses.items.map((r) => ({
            id: r.article.$.id,
            url: r.article.$.url,
            siteName: r.article.$.siteName,
            title: r.article.$.title,
            excerpt: r.article.$.excerpt,
            wordCount: r.article.$.wordCount,

            read: true,
            bookmarked: bookmarkSet.has(r.article.$.id),
          })),
          cursor: readStatuses.endCursor,
        },
      };
    },

    bookmarkArticle: async ({ req, res }) => {
      // get user
      const session = await validateSession(orm.em, req, res);
      if (!session) {
        return { status: 401, body: "Unauthorized" };
      }
      const user = session.user.$;

      // get article
      const article = await orm.em.findOne(Article, {
        id: req.params.id,
      });
      if (!article) {
        return {
          status: 404,
          body: "Not Found",
        };
      }

      let bookmarked;

      // check if marking as bookmarked or unbookmarked
      if (req.body.bookmarked) {
        // mark as bookmarked

        // check for existing
        bookmarked = (await orm.em.count(Bookmark, { user, article })) > 0;

        // if not bookmarked, create Bookmark row
        if (!bookmarked) {
          const bookmark = new Bookmark(user, article);
          await orm.em.persistAndFlush(bookmark);
          bookmarked = true;
        }
      } else {
        // mark as unbookmarked
        bookmarked = false;

        // delete any Bookmark rows if they exist
        await orm.em.nativeDelete(Bookmark, { user, article });
      }

      // check if read for response
      const read = (await orm.em.count(ReadStatus, { user, article })) > 0;

      return {
        status: 200,
        body: {
          id: article.id,
          url: article.url,
          siteName: article.siteName,
          title: article.title,
          excerpt: article.excerpt,
          wordCount: article.wordCount,

          read,
          bookmarked,
        },
      };
    },

    getBookmarkedArticles: async ({ req, res }) => {
      // get user
      const session = await validateSession(orm.em, req, res);
      if (!session) {
        return { status: 401, body: "Unauthorized" };
      }
      const user = session.user.$;

      // get Bookmarks and prefetch (join) articles
      const prevCursor = req.query.cursor ?? undefined;
      const bookmarks = await orm.em.findByCursor(
        Bookmark,
        {
          user,
        },
        {
          first: ARTICLES_PER_PAGE,
          after: prevCursor,
          orderBy: { createdAt: "DESC" },
          populate: ["article"],
        }
      );

      // get read statuses for bookmarked articles for response
      const readStatusRows = await orm.em.findAll(ReadStatus, {
        where: {
          user,
          article: { $in: bookmarks.items.map((b) => b.article.$.id) },
        },
      });
      const readStatusSet = new Set(readStatusRows.map((r) => r.id));

      return {
        status: 200,
        body: {
          articles: bookmarks.items.map((b) => ({
            id: b.article.$.id,
            url: b.article.$.url,
            siteName: b.article.$.siteName,
            title: b.article.$.title,
            excerpt: b.article.$.excerpt,
            wordCount: b.article.$.wordCount,

            read: readStatusSet.has(b.article.$.id),
            bookmarked: true,
          })),
          cursor: bookmarks.endCursor,
        },
      };
    },
  });
};
