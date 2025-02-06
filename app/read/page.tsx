import Lessons from "@/components/Lessons";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/utils/auth";
import { cookies } from "next/headers";

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
          userQuizRecords.find((record) => record.quizId === quiz.quizId) ||
          null,
      })),
    }));

    return units;
  } catch (error) {
    console.error("Error fetching user quiz data:", error);
    throw error;
  }
}

export default async function Read() {
  let units: any = await prisma.unit.findMany({
    select: {
      quizes: {
        include: {
          quiz: true,
        },
      },
    },
  });

  const token: any = cookies().get("accessToken"); // Retrieve the token from cookies
  let user: any;
  let readStatus: any;
  let decoded: any;
  if (token) {
    try {
      decoded = verifyAccessToken(token.value);
      user = await prisma.user.findUnique({
        where: {
          id: parseInt(decoded.userId),
        },
      });
      readStatus = user.readStatus;
      units = await getUserWithQuizRecords(user);
    } catch (error) {
      //! add
    }
  } else {
    readStatus = 1;
  }

  return (
    <div className="flex min-h-screen flex-col mt-10 pb-24">
      <div className="mx-4">
        <h1>READ</h1>
        <div
          className="bg-green-500 h-2.5 rounded-full"
          style={{ width: `${80}%` }}
        ></div>
        <Lessons unitData={units} readStatus={readStatus} />
      </div>
    </div>
  );
}
