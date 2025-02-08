// utils/auth.ts
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRATION = "60m";

export function generateAccessToken(
  user: { userId: string; email: string },
  expiresIn = JWT_EXPIRATION
) {
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn }
  );
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

// Example of generating a refresh token
export function generateRefreshToken(userId: string) {
  const refreshTokenSecret: any = process.env.REFRESH_TOKEN_SECRET;
  return jwt.sign({ userId }, refreshTokenSecret, { expiresIn: "7d" }); // 7 days expiration
}

export function verifyRefreshToken(token: string) {
  const refreshTokenSecret: any = process.env.REFRESH_TOKEN_SECRET;
  try {
    return jwt.verify(token, refreshTokenSecret);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
