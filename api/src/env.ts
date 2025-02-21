import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.number().nullish(),
});

export const env = envSchema.parse(process.env);
