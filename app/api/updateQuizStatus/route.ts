import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { NewLetterData } from "@/components/Step";
import { verifyAccessToken } from "@/utils/auth";

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
  const decoded: any = verifyAccessToken(accessToken);

  const { quiz_id } = await req.json();

  const unit = await prisma.quizesOnUnits.findFirst({
    where: {
      quizId: 28, // Find the row where the given quiz exists
    },
    include: {
      unit: true, // Include the unit details
    },
  });

  const user: any = await prisma.user.findUnique({
    where: {
      id: parseInt(decoded.userId),
    },
    include: {
      lives: true,
    },
  });

  const record = await prisma.usersOnQuizes.findFirst({
    where: {
      userId: parseInt(decoded.userId),
      quizId: quiz_id,
      status: "complete", // Check if the status is already complete
    },
    select: { status: true }, // Only fetch ID to optimize performance
  });

  //! update this when we add the speak quizes
  if ((unit?.unit.id ?? 0 > 1) && record === null) {
    const updatedPivot = await prisma.usersOnQuizes.updateMany({
      where: {
        userId: parseInt(decoded.userId),
        quizId: quiz_id,
      },
      data: {
        status: "complete",
      },
    });

    //! be vary of the hundred once adding other units
    if (unit?.unit.id ?? 100 <= user.readStatus) {
      const quizes = await prisma.quizesOnUnits.findMany({
        where: { unitId: unit?.unit.id },
        select: { quizId: true },
      });

      const quizIds = quizes.map((q) => q.quizId);

      if (quizIds.length === 0) {
        console.log("No quizzes found for this unit.");
        return;
      }

      // Fetch the user's quiz statuses for these quizzes
      const userQuizStatuses = await prisma.usersOnQuizes.findMany({
        where: {
          userId: parseInt(decoded.userId),
          quizId: { in: quizIds },
        },
        select: { status: true },
      });

      // Check if all quizzes have the status "complete"
      const allCompleted = userQuizStatuses.every(
        (q) => q.status === "complete"
      );

      if (allCompleted) {
        const updatedUser = await prisma.user.update({
          where: { id: parseInt(decoded.userId) },
          data: {
            readStatus: {
              increment: 1,
            },
          },
        });
      }
    }
  }

  return new Response(JSON.stringify({ status: "Successfully Updated" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
