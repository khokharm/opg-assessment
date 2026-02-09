import { Router } from "express";

/**
 * Creates the health-check router.
 * @returns An Express router exposing health endpoints.
 */
export const createHealthRouter = () => {
  const router = Router();

  /**
   * Health-check endpoint.
   * GET /health -> returns 200 OK
   */
  router.get("/", (_req, res) => {
    res.json({ status: "ok" });
  });

  return router;
};
