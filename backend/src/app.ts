import express, { type NextFunction, type Request, type Response } from "express";
import { createHealthRouter } from "./routes/health";

export const createApp = () => {
  const app = express();

  app.disable("x-powered-by");

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/health", createHealthRouter());

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use(
    (
      err: unknown,
      _req: Request,
      res: Response,
      _next: NextFunction,
    ) => {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("unhandled error", message);
      res.status(500).json({ error: "Internal server error" });
    },
  );

  return app;
};
