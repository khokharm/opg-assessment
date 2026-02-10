import "dotenv/config";

import { z } from "zod";

const DEFAULT_PORT = 4000;

const envSchema = z.object({
  PORT: z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    },
    z
      .coerce
      .number()
      .int()
      .min(1, "PORT must be between 1 and 65535.")
      .max(65535, "PORT must be between 1 and 65535.")
      .default(DEFAULT_PORT),
  ),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid environment variables: ${details}`);
}

export const env = {
  port: parsed.data.PORT,
};
