import ReadPage from "@/components/ReadPage";
import { ThemeProvider } from "@/components/ThemeProvider";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/utils/auth";
import { updatePremiumStatus } from "@/utils/checkPremium";
import { errorWithFile } from "@/utils/logger";
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
    errorWithFile(error);
    quizCompletionPercentage = 0;
    readStatus = 1;
  }

  const sinhalaObjects = sinhalaCharacters.map((char) => ({
    value: char,
    name: char,
  }));

  return (
    <div className="flex min-h-screen flex-col items-center mt-10 pb-24 animate-fadeIn">
      <ThemeProvider>
        <ReadPage
          quizCompletionPercentage={quizCompletionPercentage}
          decoded={decoded}
          sinhalaObjects={sinhalaObjects}
          isPremium={isPremium}
          units={units}
          readStatus={readStatus}
        />
      </ThemeProvider>
    </div>
  );
}
