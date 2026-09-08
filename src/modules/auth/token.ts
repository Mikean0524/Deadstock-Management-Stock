import crypto from "node:crypto";
import type { AuthenticatedUser, Role } from "../../types/auth.js";

interface JwtPayload {
  sub: string;
  role: Role;
  iat: number;
  exp: number;
}

function base64UrlEncode(input: Buffer | string): string {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buffer.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(input: string): Buffer {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Buffer.from(padded, "base64");
}

function parseExpiresIn(expiresIn: string): number {
  const trimmed = expiresIn.trim();
  const match = trimmed.match(/^(\d+)([smhd])?$/i);
  if (!match) return 60 * 60 * 12;
  const value = Number(match[1]);
  const unit = (match[2] ?? "s").toLowerCase();
  const multipliers = { s: 1, m: 60, h: 60 * 60, d: 60 * 60 * 24 } as const;
  return value * multipliers[unit as keyof typeof multipliers];
}

export function issueAuthToken(user: AuthenticatedUser, secret: string, expiresIn: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    sub: user.id,
    role: user.role,
    iat: now,
    exp: now + parseExpiresIn(expiresIn)
  };
  const header = { alg: "HS256", typ: "JWT" };
  const headerPart = base64UrlEncode(JSON.stringify(header));
  const payloadPart = base64UrlEncode(JSON.stringify(payload));
  const data = `${headerPart}.${payloadPart}`;
  const signature = crypto.createHmac("sha256", secret).update(data).digest();
  return `${data}.${base64UrlEncode(signature)}`;
}

export function verifyAuthToken(token: string, secret: string): AuthenticatedUser {
  const [headerPart, payloadPart, signaturePart] = token.split(".");
  if (!headerPart || !payloadPart || !signaturePart) {
    throw new Error("Invalid token");
  }

  const data = `${headerPart}.${payloadPart}`;
  const expected = base64UrlEncode(crypto.createHmac("sha256", secret).update(data).digest());
  const signature = Buffer.from(signaturePart);
  const expectedBuffer = Buffer.from(expected);
  if (signature.length !== expectedBuffer.length || !crypto.timingSafeEqual(signature, expectedBuffer)) {
    throw new Error("Invalid token signature");
  }

  const payload = JSON.parse(base64UrlDecode(payloadPart).toString("utf8")) as JwtPayload;
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now) throw new Error("Token expired");
  return { id: payload.sub, role: payload.role };
}
