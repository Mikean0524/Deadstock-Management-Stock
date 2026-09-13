import type { RequestHandler } from "express";

export type Role = "VENDOR" | "BUYER" | "ADMIN";

export interface AuthenticatedUser {
  id: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// Aryan's JWT middleware populates req.user with this shape.
export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, error: { message: "Authentication required" } });
  next();
};

export const requireRole = (...roles: Role[]): RequestHandler => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: { message: "Insufficient permissions" } });
  }
  next();
};
