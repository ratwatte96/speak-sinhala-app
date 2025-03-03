import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { errorWithFile } from "@/utils/logger";
import { extractAccessToken, verifyAccessToken } from "@/utils/auth";

//!Refactor magic numbers?

export async function GET(req: Request) {
  const url = new URL(req.url);
  const quizId: any = url.searchParams.get("quizId");
  let decoded: any;

  try {
    if (
      !["28", "29", "30", "31", "32", "33"].includes(quizId) ||
      quizId == null
    ) {
      const accessToken = extractAccessToken(req);
      if (!accessToken) {
        return NextResponse.json(
          { error: "Access token missing" },
          { status: 401 }
        );
      }

      decoded = verifyAccessToken(accessToken);
      if (!decoded) {
        return NextResponse.json(
          { error: "Invalid access token" },
          { status: 403 }
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

    const fileStat = fs.statSync(filePath);

    // Stream the file if it exists
    const headers = new Headers();
    headers.append("Content-Type", "audio/mpeg");
    headers.append("Content-Length", fileStat.size.toString());
    const fileStream: any = fs.createReadStream(filePath);
    return new NextResponse(fileStream, { headers });
  } catch (error) {
    errorWithFile(error, decoded?.userId);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
