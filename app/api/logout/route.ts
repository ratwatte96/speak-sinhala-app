import { NextResponse } from "next/server";

export async function POST() {
  const isDev = process.env.NODE_ENV === "development";

  const cookieOptions = {
    accessToken: [
      "accessToken=;",
      "HttpOnly",
      "Path=/",
      "Max-Age=0", // Expire immediately
      isDev ? "" : "Secure",
    ]
      .filter(Boolean)
      .join("; "),
    refreshToken: [
      "refreshToken=;",
      "HttpOnly",
      "Path=/",
      "Max-Age=0", // Expire immediately
      isDev ? "" : "Secure",
    ]
      .filter(Boolean)
      .join("; "),
  };

  return new NextResponse("Logout successful", {
    status: 200,
    headers: {
      "Set-Cookie": [
        cookieOptions.accessToken,
        cookieOptions.refreshToken,
      ].join(", "),
    },
  });
}
