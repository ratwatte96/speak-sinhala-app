import prisma from "@/lib/prisma";

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
    console.error("Error fetching user quiz data:", error);
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
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
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
