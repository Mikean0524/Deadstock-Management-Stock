import express from "express";
import { ZodError } from "zod";
import { listingRouter } from "./modules/listings/routes.js";
import { verificationRouter } from "./modules/verification/routes.js";

export const app = express();
app.use(express.json());
app.get("/api/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));
app.use("/api/verification", verificationRouter);
app.use("/api/listings", listingRouter);
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) return res.status(400).json({ success: false, error: { message: "Validation failed", details: error.flatten() } });
  console.error(error);
  res.status(500).json({ success: false, error: { message: "Internal server error" } });
});
