import LessonCard, { Lesson } from "@/components/LessonCard";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/utils/auth";
import { cookies } from "next/headers";

export default async function Read() {
  const units: any = await prisma.unit.findMany({
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
  if (token) {
    try {
      const decoded: any = verifyAccessToken(token.value);
      user = await prisma.user.findUnique({
        where: {
          id: parseInt(decoded.userId),
        },
      });
      readStatus = user.readStatus;
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
        status: unitIndex + 1 <= readStatus ? "incomplete" : "locked",
        //! need to add info from pivot table:  status: readStatus <= unitIndex + 1 ? quiz.quiz.status : "locked",
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
