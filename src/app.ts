import express from "express";
import { ZodError } from "zod";
import { authenticateRequest } from "./modules/auth/middleware.js";
import { authRouter } from "./modules/auth/routes.js";
import { inventoryRouter } from "./modules/inventory/routes.js";
import { listingRouter } from "./modules/listings/routes.js";
import { verificationRouter } from "./modules/verification/routes.js";

export const app = express();
// The Vite UI runs on a different local port during development.
app.use((req, res, next) => {
  const origin = req.header("origin");
  if (origin === "http://localhost:5173" || origin === "http://127.0.0.1:5173") {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use(express.json());
app.use(authenticateRequest);
app.get("/api/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));
app.use("/api/auth", authRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/verification", verificationRouter);
app.use("/api/listings", listingRouter);
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) return res.status(400).json({ success: false, error: { message: "Validation failed", details: error.flatten() } });
  console.error(error);
  res.status(500).json({ success: false, error: { message: "Internal server error" } });
});
