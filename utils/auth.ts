// utils/auth.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRATION = "15m"; // 15 minutes

export function generateAccessToken(user: {
  userId: string;
  email: string;
  //!   isPremium: boolean;
}) {
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      //!   isPremium: user.isPremium,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
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
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" }); // 7 days expiration
}

export function verifyRefreshToken(token: string) {
  const refreshTokenSecret: any = process.env.REFRESH_TOKEN_SECRET;
  try {
    return jwt.verify(token, refreshTokenSecret);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
}
