import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const quizId: any = url.searchParams.get("quizId");
  if (
    !["28", "29", "30", "31", "32", "33"].includes(quizId) ||
    quizId == null
  ) {
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
  }

  const audioPath = url.searchParams.get("path");

  if (!audioPath) {
    return NextResponse.json(
      { error: "No audio path provided" },
      { status: 400 }
    );
  }

  // Construct the file path inside the public directory
  const filePath = path.join(process.cwd(), "public", audioPath);

  try {
    const fileStat = fs.statSync(filePath);

    // Stream the file if it exists
    const headers = new Headers();
    headers.append("Content-Type", "audio/mpeg");
    headers.append("Content-Length", fileStat.size.toString());
    const fileStream: any = fs.createReadStream(filePath);
    return new NextResponse(fileStream, { headers });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
