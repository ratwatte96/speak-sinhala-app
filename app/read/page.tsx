import ReadPage from "@/components/ReadPage";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/utils/auth";
import { updatePremiumStatus } from "@/utils/checkPremium";
import { errorWithFile } from "@/utils/logger";
import {
  getQuizCompletionPercentage,
  getUserData,
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
import { TutorialModal } from "@/components/TutorialModal";

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
  let userData: any;
  let quizCompletionPercentage;
  try {
    if (token && verifyAccessToken(token.value)) {
      decoded = verifyAccessToken(token.value);
      user = await prisma.user.findUnique({
        where: {
          id: parseInt(decoded.userId),
        },
      });
      userData = await getUserData(user);
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

  let storageName = "firstTime";
  let tutorialText = [
    "This site will help you practice reading and speaking Sinhala. During the beta phase, only reading exercises are available.",
    "Our structured course includes 13 quiz-based units to help you master Sinhala reading. You can start with Unit 1 for free. No sign-up required!",
    "Unlock all units for free by signing up. Start learning today and make steady progress on your Sinhala journey!",
  ];
  if (decoded) {
    storageName = "firstLogin";
    tutorialText = [
      "Thanks for signing up! Practice daily to improve and maintain your learning streak.",
      "Now that you're signed up, you'll receive 5 lives each day, but unlimited refills are no longer available.",
      "You can purchase refills from the shop. During the beta phase, refills are free.",
      "Premium members get unlimited refills and access to the custom quiz feature. You can upgrade in the shop for free.",
      "Good luck on your Sinhala learning journey!",
    ];
  }

  return (
    <SharedStateProvider>
      <ThemeProvider>
        <TopNavbar loggedOut={!decoded} isPremium={isPremium} />
        <ReadPage
          quizCompletionPercentage={quizCompletionPercentage}
          decoded={decoded}
          sinhalaObjects={sinhalaObjects}
          isPremium={isPremium}
          units={units}
          readStatus={readStatus}
          userData={userData}
        />
        <BottomNavbar />
        <TutorialModal
          localStorageName={storageName}
          tutorialText={tutorialText}
          title={"Learn Sinhala"}
        />
      </ThemeProvider>
    </SharedStateProvider>
  );
}
