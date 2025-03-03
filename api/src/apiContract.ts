import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string().optional(),
});

const articleSchema = z.object({
  id: z.string().uuid(),
  url: z.string(),
  siteName: z.string(),
  title: z.string(),
  excerpt: z.string(),
  wordCount: z.number(),
});

const moderationStatusSchema = z.enum(["approved", "rejected"]);
const submissionSchema = z.object({
  id: z.string().uuid(),
  url: z.string(),
  moderationStatus: moderationStatusSchema.nullable(),
});

export const contract = c.router({
  register: {
    summary: "Register an account",
    method: "POST",
    path: "/auth/register",
    body: z.object({
      username: z.string(),
      password: z.string(),
    }),
    responses: {
      200: userSchema,
      401: z.string(),
    },
  },
  login: {
    summary: "Log in to an account",
    method: "POST",
    path: "/auth/login",
    body: z.object({
      username: z.string(),
      password: z.string(),
    }),
    responses: {
      200: userSchema,
      401: z.string(),
    },
  },
  logout: {
    summary: "Log out of an account",
    method: "POST",
    path: "/auth/logout",
    body: z.object({}),
    responses: {
      200: z.string(),
    },
  },

  getUser: {
    summary: "Get the logged in user",
    method: "GET",
    path: "/user",
    responses: {
      200: userSchema,
      401: z.string(),
    },
  },

  /**
   * Get a list of articles.
   *
   * May return a cursor if there are more results available. The frontend
   * can make another request and pass the cursor string to get the next page
   * of results.
   */
  getArticles: {
    summary: "Gets articles",
    method: "GET",
    path: "/articles",
    query: z.object({
      cursor: z.string().nullish(),
    }),
    responses: {
      200: z.object({
        articles: z.array(articleSchema),
        cursor: z.string().nullable(),
      }),
    },
  },

  /**
   * Submit an article for moderation.
   */
  submitArticle: {
    summary: "Submit an article",
    method: "POST",
    path: "/articles/submit",
    body: z.object({
      url: z.string().url(),
    }),
    responses: {
      200: submissionSchema,
    },
  },

  /**
   * Get a list of submissions.
   *
   * Requires moderator status.
   *
   * May return a cursor if there are more results available. The frontend
   * can make another request and pass the cursor string to get the next page
   * of results.
   */
  getSubmissions: {
    summary: "Gets submissions",
    method: "GET",
    path: "/submissions",
    query: z.object({
      cursor: z.string().nullish(),
    }),
    responses: {
      200: z.object({
        submissions: z.array(submissionSchema),
        cursor: z.string().nullable(),
      }),
    },
  },

  /**
   * Mark a submission as approved or rejected.
   *
   * Requires moderator status.
   */
  moderateSubmission: {
    summary: "Mark a submission as approved or rejected",
    method: "POST",
    path: "/submissions/:id/moderate",
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      status: moderationStatusSchema,
    }),
    responses: {
      200: submissionSchema,
    },
  },
});
