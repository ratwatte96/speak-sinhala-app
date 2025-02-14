import { CompletionBar } from "@/components/CompletionBar";
import { CustomQuizForm } from "@/components/CustomQuizForm";
import Lessons from "@/components/Lessons";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/utils/auth";
import { updatePremiumStatus } from "@/utils/checkPremium";
import {
  getQuizCompletionPercentage,
  getUserWithQuizRecords,
  sinhalaCharacters,
} from "@/utils/random";
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
  let isPremium = false;
  let quizCompletionPercentage;
  try {
    if (token && verifyAccessToken(token.value)) {
      decoded = verifyAccessToken(token.value);
      user = await prisma.user.findUnique({
        where: {
          id: parseInt(decoded.userId),
        },
      });
      readStatus = user.readStatus;
      quizCompletionPercentage = await getQuizCompletionPercentage(user.id);
      units = await getUserWithQuizRecords(user);
      isPremium = await updatePremiumStatus(parseInt(decoded.userId));
    } else {
      readStatus = 1;
      quizCompletionPercentage = 0;
    }
  } catch (error) {
    console.log(error);
    quizCompletionPercentage = 0;
    readStatus = 1;
  }

  const sinhalaObjects = sinhalaCharacters.map((char) => ({
    value: char,
    name: char,
  }));

  return (
    <div className="flex min-h-screen flex-col items-center mt-10 pb-24">
      <div className="mx-4 w-[20rem] sm:w-96 ">
        <h1 className="font-serif mb-1 text-2xl">READ</h1>
        <CompletionBar quizPercentage={quizCompletionPercentage} />
        {decoded && (
          <CustomQuizForm
            dropDownLetters={sinhalaObjects}
            isPremium={isPremium}
          />
        )}
        <div>
          <Lessons unitData={units} readStatus={readStatus} />
        </div>
      </div>
    </div>
  );
}
