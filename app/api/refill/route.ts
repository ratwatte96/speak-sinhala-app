import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { verifyAccessToken } from "@/utils/auth";

//TODO: need to lock up this endpoint
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

  //! add try catch
  const decoded: any = verifyAccessToken(accessToken);
  const user: any = await prisma.user.findUnique({
    where: {
      id: parseInt(decoded.userId),
    },
    include: {
      lives: true,
    },
  });
  const lives = await prisma.lives.findUnique({
    where: {
      id: user.lives[0].livesId,
    },
  });

  let newLives: any = lives;
  if (lives?.total_lives === 0) {
    newLives = await prisma.lives.update({
      where: {
        id: newLives.id,
      },
      data: {
        last_active_time: new Date(),
        total_lives: 5,
      },
    });
  }
  return new Response(JSON.stringify(newLives), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
