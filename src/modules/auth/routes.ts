import { Prisma } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { env } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";
import { requireAuth } from "../../types/auth.js";
import { hashPassword, verifyPassword } from "./password.js";
import { issueAuthToken } from "./token.js";

const selfServeRoleSchema = z.enum(["VENDOR", "BUYER"]);
const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(200),
  role: selfServeRoleSchema.default("VENDOR")
});
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

function publicUser(user: { id: string; name: string; email: string; role: "VENDOR" | "BUYER" | "ADMIN" }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const email = body.email.toLowerCase();
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, error: { message: "Email is already registered" } });
    }

    const createdUser = await prisma.users.create({
      data: {
        name: body.name,
        email,
        password_hash: await hashPassword(body.password),
        role: body.role
      }
    });

    const token = issueAuthToken({ id: createdUser.id, role: createdUser.role }, env.JWT_SECRET, env.JWT_EXPIRES_IN);
    res.status(201).json({ success: true, data: { user: publicUser(createdUser), token } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(409).json({ success: false, error: { message: "Email is already registered" } });
    }
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const user = await prisma.users.findUnique({ where: { email: body.email.toLowerCase() } });
    if (!user) return res.status(401).json({ success: false, error: { message: "Invalid email or password" } });

    const passwordMatches = await verifyPassword(body.password, user.password_hash);
    if (!passwordMatches) return res.status(401).json({ success: false, error: { message: "Invalid email or password" } });

    const token = issueAuthToken({ id: user.id, role: user.role }, env.JWT_SECRET, env.JWT_EXPIRES_IN);
    res.json({ success: true, data: { user: publicUser(user), token } });
  } catch (error) {
    next(error);
  }
});

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true, created_at: true }
    });
    if (!user) return res.status(404).json({ success: false, error: { message: "User not found" } });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});
