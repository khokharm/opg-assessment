import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthRouter from "./routes/health";
import weatherRouter from "./routes/weather";
import authRouter from "./routes/auth";
import userCitiesRouter from "./routes/userCities";
import { authenticate } from "./middleware/auth";

export const createApp = () => {
  const app = express();

  app.disable("x-powered-by");

  // CORS configuration - allow credentials
  app.use(
    cors({
      origin: true, // Allow all origins in development, configure properly in production
      credentials: true,
    })
  );

  // Cookie parser
  app.use(cookieParser());

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Health check route (public)
  app.use("/health", healthRouter);

  // Authentication routes (public)
  app.use("/api/auth", authRouter);

  // User routes (protected)
  app.use("/api/user", authenticate, userCitiesRouter);

  // Weather routes (public - can be protected if needed)
  app.use("/api", weatherRouter);

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
