import "dotenv/config";

export const env = {
  JWT_SECRET: process.env.JWT_SECRET ?? "dev-only-change-me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "12h",
  PASSWORD_SALT_ROUNDS: Number(process.env.PASSWORD_SALT_ROUNDS ?? 12),
  AGING_THRESHOLD_DAYS: Number(process.env.AGING_THRESHOLD_DAYS ?? 30),
  DEADSTOCK_THRESHOLD_DAYS: Number(process.env.DEADSTOCK_THRESHOLD_DAYS ?? 60),
  PORT: Number(process.env.PORT ?? 4000)
} as const;
