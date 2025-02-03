import LessonCard, { Lesson } from "@/components/LessonCard";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/utils/auth";
import { cookies } from "next/headers";

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

      units = await prisma.unit.findMany({
        include: {
          quizes: {
            include: {
              quiz: true, // Include basic quiz info
            },
          },
        },
      });

      const quizIds = units.flatMap((unit: any) =>
        unit.quizes.map((q: any) => q.quizId)
      );

      const userQuizRecords = await prisma.usersOnQuizes.findMany({
        where: {
          userId: parseInt(decoded.userId),
          quizId: { in: quizIds },
        },
      });

      units = units.map((unit: any) => ({
        ...unit,
        quizes: unit.quizes.map((quiz: any) => ({
          ...quiz,
          userQuizRecord:
            userQuizRecords.find((record) => record.quizId === quiz.quizId) ||
            null,
        })),
      }));
    } catch (error) {
      //! add
    }
  } else {
    readStatus = 1;
  }

  let quizData: any = [];
  units.forEach((unit: any, unitIndex: number) => {
    quizData[unitIndex] = { unitId: unitIndex + 1, quizes: [] };
    unit.quizes.forEach((quiz: any, quizIndex: number) => {
      quizData[unitIndex].quizes.push({
        quizName: quiz.quiz.quiz_name,
        content: quiz.quiz.content,
        type: quiz.quiz.type,
        description: quiz.quiz.description,
        status:
          unitIndex + 1 <= readStatus
            ? quiz.userQuizRecord?.status ?? "incomplete"
            : "locked",
      });
    });
  });

  return (
    <div className="flex min-h-screen flex-col mt-10 pb-24">
      <div className="mx-4">
        <h1>READ</h1>
        <div
          className="bg-green-500 h-2.5 rounded-full"
          style={{ width: `${80}%` }}
        ></div>
        {quizData.map((unitData: any) => (
          <div>
            <div className="flex justify-center">
              <h2>{`Unit: ${unitData.unitId}`}</h2>
            </div>
            {unitData.quizes.map((quizData: any) => (
              <LessonCard key={quizData.quizName} lesson={quizData} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
