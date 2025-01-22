import { NextResponse } from "next/server";

export async function POST(req: any) {
  const cookies = req.headers.get("cookie");
  if (!cookies) {
    return NextResponse.json({ error: "No cookies found" }, { status: 400 });
  }

  // Parse cookies (basic approach)
  const cookieArray = cookies
    .split("; ")
    .map((cookie: any) => cookie.split("="));
  const cookieMap = Object.fromEntries(cookieArray);

  const accessToken = cookieMap["accessToken"];

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token missing" },
      { status: 401 }
    );
  }

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
