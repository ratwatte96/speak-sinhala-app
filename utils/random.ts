import prisma from "@/lib/prisma";
import { errorWithFile } from "./logger";

export async function getUserWithQuizRecords(user: any) {
  try {
    // Fetch all units with quizzes
    let units = await prisma.unit.findMany({
      include: {
        quizes: {
          include: {
            quiz: true, // Include quiz details
          },
        },
      },
    });

    // Extract quiz IDs from units
    const quizIds = units.flatMap((unit: any) =>
      unit.quizes.map((q: any) => q.quizId)
    );

    // Fetch user's quiz records
    const userQuizRecords = await prisma.usersOnQuizes.findMany({
      where: {
        userId: parseInt(user.id),
        quizId: { in: quizIds },
      },
    });

    // Attach user quiz records to quizzes in units
    units = units.map((unit: any) => ({
      ...unit,
      quizes: unit.quizes.map((quiz: any) => ({
        ...quiz,
        userQuizRecord:
          userQuizRecords.find(
            (record: any) => record.quizId === quiz.quizId
          ) || null,
      })),
    }));

    return units;
  } catch (error) {
    errorWithFile(error, user.id);
    throw error;
  }
}

export async function getQuizCompletionPercentage(
  userId: number
): Promise<number> {
  const totalQuizzes = 74;
  const completedQuizzes = await prisma.usersOnQuizes.count({
    where: {
      userId: userId,
      status: "complete",
      quiz: {
        units: {
          some: {
            unit: {
              id: {
                gte: 1,
                lte: 13,
              },
            },
          },
        },
      },
    },
  });

  return (completedQuizzes / totalQuizzes) * 100;
}

export async function getUserData(user: any) {
  try {
    const readPercentage = await getQuizCompletionPercentage(user.id);

    return {
      username: user.username,
      email: user.email,
      readPercentage: Math.floor(readPercentage),
      premiumEndDate: user.premiumEndDate,
      gender: user.gender,
    };
  } catch (error) {
    errorWithFile(error, user.id);
    throw error;
  }
}

export function checkPath(pathname: any) {
  return (
    (pathname.includes("quiz") &&
      ["28", "29", "30", "31", "32", "33"].includes(
        pathname.split("/").pop() || "0"
      )) ||
    pathname.includes("read") ||
    pathname.includes("speak") ||
    pathname.includes("shop") ||
    pathname.includes("profile")
  );
}

export const sinhalaCharacters = [
  "ක",
  "ඛ",
  "ග",
  "ඝ",
  "ඞ",
  "ඟ",
  "ච",
  "ඡ",
  "ජ",
  "ඣ",
  "ඤ",
  "ඥ",
  "ඦ",
  "ට",
  "ඨ",
  "ඩ",
  "ඪ",
  "ණ",
  "ඬ",
  "ත",
  "ථ",
  "ද",
  "ධ",
  "න",
  "ඳ",
  "ප",
  "ඵ",
  "බ",
  "භ",
  "ම",
  "ඹ",
  "ය",
  "ර",
  "ල",
  "ළ",
  "ව",
  "හ",
  "ශ",
  "ෂ",
  "ස",
  "ෆ",
  "අ",
  "ආ",
  "ඇ",
  "ඈ",
  "ඉ",
  "ඊ",
  "උ",
  "ඌ",
  "එ",
  "ඒ",
  "ඓ",
  "ඔ",
  "ඕ",
  "ඖ",
  "ඍ",
  "ඎ",
  "ඏ",
  "ඐ",
];

export async function getNextQuizId(quizId: number) {
  // Find the unit that contains this quiz
  const quizInUnit = await prisma.quizesOnUnits.findFirst({
    where: { quizId },
    include: { unit: { include: { quizes: true } } },
  });

  if (!quizInUnit) {
    throw new Error("Quiz not found in any unit.");
  }

  const { unit } = quizInUnit;

  // Extract quiz IDs in their existing order
  const quizIds = unit.quizes.map((q) => q.quizId);

  // Find the current quiz index
  const currentIndex = quizIds.indexOf(quizId);

  // If there is a next quiz in the same unit, return it
  if (currentIndex !== -1 && currentIndex < quizIds.length - 1) {
    return quizIds[currentIndex + 1];
  }

  // If this is the last quiz in the unit, find the next unit
  const nextUnit = await prisma.unit.findFirst({
    where: { id: { gt: unit.id } }, // Get the next unit (assuming units are in order)
    include: { quizes: true },
    orderBy: { id: "asc" }, // Ensure we get the next unit in order
  });

  if (nextUnit && nextUnit.quizes.length > 0) {
    return nextUnit.quizes[0].quizId; // Return the first quiz of the next unit
  }

  return "NoNextQuiz";
}
