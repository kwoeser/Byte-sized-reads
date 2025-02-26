import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.preprocess((input) => {
    if (typeof input === "string") return parseInt(input);
    return input;
  }, z.number().nullish()),
});

export const env = envSchema.parse(process.env);
