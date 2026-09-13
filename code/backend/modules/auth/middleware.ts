import type { RequestHandler } from "express";
import { env } from "../../config/env.js";
import { verifyAuthToken } from "./token.js";

export const authenticateRequest: RequestHandler = (req, res, next) => {
  const authorization = req.header("authorization");
  if (!authorization) return next();

  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, error: { message: "Invalid authorization header" } });
  }

  try {
    req.user = verifyAuthToken(token, env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ success: false, error: { message: "Invalid or expired token" } });
  }
};
