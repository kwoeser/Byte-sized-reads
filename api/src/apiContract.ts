import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const userSchema = z.object({
  id: z.string(),
  username: z.string().optional(),
});

export const contract = c.router({
  hello: {
    summary: "Test endpoint",
    method: "GET",
    path: "/hello",
    responses: {
      200: z.string(),
    },
  },

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
});
