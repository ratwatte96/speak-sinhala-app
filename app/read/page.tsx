import ReadPage from "@/components/ReadPage";
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
import { redirect } from "next/navigation";
import BottomNavbar from "@/components/BottomNavbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import TopNavbar from "@/components/TopNavBar";
import type { Metadata } from "next";
import { SharedStateProvider } from "@/components/StateProvider";

//!Refactor

export const metadata: Metadata = {
  title: "Learn Sinhala",
  description: "Website to make learning how to read and speak sinhala fun",
};

export default async function Read() {
  let units: any;
  try {
    units = await prisma.unit.findMany({
      select: {
        quizes: {
          include: {
            quiz: true,
          },
        },
      },
    });
  } catch (error) {
    errorWithFile(error);
    redirect(`/error`);
  }

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
    <SharedStateProvider>
      <ThemeProvider>
        <TopNavbar loggedOut={!decoded} isPremium={isPremium} />
        <div className="flex min-h-screen flex-col items-center pb-24 animate-fadeIn bg-[#EAEAEA] dark:bg-black">
          <ReadPage
            quizCompletionPercentage={quizCompletionPercentage}
            decoded={decoded}
            sinhalaObjects={sinhalaObjects}
            isPremium={isPremium}
            units={units}
            readStatus={readStatus}
          />
        </div>
        <BottomNavbar />
      </ThemeProvider>
    </SharedStateProvider>
  );
}
