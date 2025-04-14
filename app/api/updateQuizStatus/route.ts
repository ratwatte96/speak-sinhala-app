import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { extractAccessToken, verifyAccessToken } from "@/utils/auth";
import { errorWithFile, logWithFile } from "@/utils/logger";
import { calculateXP, getSriLankaDayAnchor } from "../../lib/experience-points";
import type { QuizType } from "../../lib/experience-points/types";
import { getUserRank, updateRankings } from "@/app/lib/leaderboard/service";

//!Refactor

export async function POST(req: any) {
  const accessToken = extractAccessToken(req);

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token missing" },
      { status: 401 }
    );
  }

  let decoded: any;
  let xpData:
    | {
        awarded: number;
        dailyTotal: number;
        totalXP: number;
        dailyRank: number | null;
        allTimeRank: number | null;
      }
    | undefined;

  try {
    decoded = verifyAccessToken(accessToken);

    const { quiz_id, perfect_score } = await req.json();

    // Get quiz details including type
    const quiz = await prisma.quiz.findUnique({
      where: { id: quiz_id },
      select: { type: true },
    });

    if (!quiz?.type) {
      return NextResponse.json({ error: "Invalid quiz type" }, { status: 400 });
    }

    const unit = await prisma.quizesOnUnits.findFirst({
      where: {
        quizId: quiz_id,
      },
      include: {
        unit: true,
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

    // Check if user already has XP for today
    const today = getSriLankaDayAnchor();
    const existingXP = await prisma.experiencePoints.findUnique({
      where: {
        userId_date: {
          userId: parseInt(decoded.userId),
          date: today,
        },
      },
    });

    // Calculate and award XP
    const xpToAward = calculateXP({
      quizType: quiz.type as QuizType,
      isPerfectScore: perfect_score,
      isFirstCompletionOfDay: !existingXP,
    });

    console.log("xpToAward", xpToAward);

    // Update or create daily XP record and update total XP
    const [dailyXP, updatedUser] = await prisma.$transaction([
      prisma.experiencePoints.upsert({
        where: {
          userId_date: {
            userId: parseInt(decoded.userId),
            date: today,
          },
        },
        create: {
          userId: parseInt(decoded.userId),
          date: today,
          amount: xpToAward,
        },
        update: {
          amount: {
            increment: xpToAward,
          },
        },
      }),
      prisma.user.update({
        where: { id: parseInt(decoded.userId) },
        data: {
          totalExperiencePoints: {
            increment: xpToAward,
          },
        },
      }),
    ]);

    // Update leaderboard rankings
    await Promise.all([updateRankings("daily"), updateRankings("allTime")]);

    // Get updated ranks
    const [dailyRank, allTimeRank] = await Promise.all([
      getUserRank(parseInt(decoded.userId), "daily"),
      getUserRank(parseInt(decoded.userId), "allTime"),
    ]);

    xpData = {
      awarded: xpToAward,
      dailyTotal: dailyXP.amount,
      totalXP: updatedUser.totalExperiencePoints,
      dailyRank,
      allTimeRank,
    };

    //! update this when we add the speak quizes
    if (record.status !== "complete") {
      // Update quiz status
      await prisma.usersOnQuizes.updateMany({
        where: {
          userId: parseInt(decoded.userId),
          quizId: quiz_id,
        },
        data: {
          status: "complete",
          completionCount: {
            increment: 1,
          },
        },
      });

      //! be vary of the hundred once adding other units
      if ((unitId ?? 100) <= user.readStatus) {
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

    return new Response(
      JSON.stringify({
        status: "Successfully Updated",
        xp: xpData,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    errorWithFile(error, decoded?.userId);
    return NextResponse.json(
      { error: "Failed to update user quiz status" },
      { status: 500 }
    );
  }
}
