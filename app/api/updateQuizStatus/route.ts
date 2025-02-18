import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { verifyAccessToken } from "@/utils/auth";
import { errorWithFile, logWithFile } from "@/utils/logger";

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
  try {
    const decoded: any = verifyAccessToken(accessToken);

    const { quiz_id, perfect_score } = await req.json();

    const unit = await prisma.quizesOnUnits.findFirst({
      where: {
        quizId: quiz_id, // Find the row where the given quiz exists
      },
      include: {
        unit: true, // Include the unit details
      },
    });
    const unitId: any = unit?.unit.id;

    const user: any = await prisma.user.findUnique({
      where: {
        id: parseInt(decoded.userId),
      },
      include: {
        lives: true,
      },
    });

    const record: any = await prisma.usersOnQuizes.findFirst({
      where: {
        userId: parseInt(decoded.userId),
        quizId: quiz_id,
      },
    });

    if (perfect_score && !record.perfect_score) {
      await prisma.usersOnQuizes.updateMany({
        where: {
          userId: parseInt(decoded.userId),
          quizId: quiz_id,
        },
        data: {
          perfect_score: perfect_score,
        },
      });
    }

    //! update this when we add the speak quizes
    if (record.status !== "complete") {
      await prisma.usersOnQuizes.updateMany({
        where: {
          userId: parseInt(decoded.userId),
          quizId: quiz_id,
        },
        data: {
          status: "complete",
        },
      });

      //! be vary of the hundred once adding other units
      if (unitId ?? 100 <= user.readStatus) {
        const quizes = await prisma.quizesOnUnits.findMany({
          where: { unitId: unitId },
          select: { quizId: true },
        });

        const quizIds = quizes.map((q) => q.quizId);

        if (quizIds.length === 0) {
          logWithFile("No quizzes found for this unit.");
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
          await prisma.user.update({
            where: { id: parseInt(decoded.userId) },
            data: {
              readStatus: {
                increment: 1,
              },
            },
          });

          if (unitId < 13) {
            const newQuizes = await prisma.unit.findFirst({
              where: {
                id: unitId + 1,
              },
              include: {
                quizes: {
                  select: {
                    quizId: true, // Only select quiz IDs
                  },
                },
              },
            });

            const newQuizIds = newQuizes?.quizes.map((q) => q.quizId) || [];

            const quizes = await prisma.quiz.findMany({
              where: {
                id: {
                  in: newQuizIds,
                },
              },
            });

            //! maybe do promise.All
            quizes.forEach(async (quiz) => {
              const connectQuizes = await prisma.user.update({
                where: {
                  id: user.id,
                },
                data: {
                  quizes: {
                    create: {
                      quiz: {
                        connect: { id: quiz.id },
                      },
                      status: "incomplete",
                    },
                  },
                },
              });
            });
          }
        }
      }
    }

    return new Response(JSON.stringify({ status: "Successfully Updated" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    errorWithFile(error);
    return NextResponse.json(
      { error: "Failed to update user quiz status" },
      { status: 500 }
    );
  }
}
