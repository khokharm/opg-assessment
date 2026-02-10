import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import healthRouter from "./routes/health";
import weatherRouter from "./routes/weather";
import authRouter from "./routes/auth";
import userCitiesRouter from "./routes/userCities";
import { authenticate } from "./middleware/auth";
import { config } from "./config";

export const createApp = () => {
  const app = express();

  // Helmet security middleware - sets various HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP for API (enable if serving HTML)
      crossOriginEmbedderPolicy: false, // Allow embedding resources
    })
  );

  app.disable("x-powered-by");

  // CORS configuration - allow credentials
  const allowedOrigins = config.cors.origins;

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, Postman, curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['Set-Cookie'],
      maxAge: 86400, // 24 hours
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
