import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(req: Request) {
  const url = new URL(req.url);
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
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
