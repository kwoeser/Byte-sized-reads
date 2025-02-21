import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const contract = c.router({
  hello: {
    summary: "Test endpoint",
    method: "GET",
    path: "/hello",
    responses: {
      200: z.string(),
    },
  },
});
