import ProfileCard from "@/components/ProfileCard";
import Shop from "@/components/ShopComponent";
import { verifyAccessToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { updatePremiumStatus } from "@/utils/checkPremium";
import prisma from "@/lib/prisma";
import Lessons from "@/components/Lessons";
import Tabs from "@/components/Tabs";
import {
  getQuizCompletionPercentage,
  getUserData,
  getUserWithQuizRecords,
  sinhalaCharacters,
} from "@/utils/random";
import { CustomQuizForm } from "@/components/CustomQuizForm";
import { CompletionBar } from "@/components/CompletionBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TutorialModal } from "@/components/TutorialModal";
import { errorWithFile } from "@/utils/logger";
import { redirect } from "next/navigation";

export default async function Home() {
  const token: any = cookies().get("accessToken"); // Retrieve the token from cookies
  let readStatus: any;
  let decoded: any;
  let userData: any;
  let isPremium = false;
  let quizCompletionPercentage;

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

  if (token) {
    try {
      decoded = verifyAccessToken(token.value);
      const user: any = await prisma.user.findUnique({
        where: { id: parseInt(decoded.userId) },
        include: { lives: true },
      });
      userData = await getUserData(user);
      isPremium = await updatePremiumStatus(parseInt(decoded.userId));
      readStatus = user.readStatus;
      units = await getUserWithQuizRecords(user);
      quizCompletionPercentage = await getQuizCompletionPercentage(user.id);
    } catch (error) {
      readStatus = 1;
      quizCompletionPercentage = 0;
      errorWithFile(error);
    }
  } else {
    readStatus = 1;
    quizCompletionPercentage = 0;
  }

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

  const sinhalaObjects = sinhalaCharacters.map((char) => ({
    value: char,
    name: char,
  }));

  return (
    <ThemeProvider>
      <div className="flex max-h-8/10 flex-col mt-10">
        <div className="mx-4 flex flex-col md:flex-row justify-around max-h-[80vh]">
          <div className="relative w-full pl-8 pr-12">
            {!decoded && (
              <div className="absolute inset-0 flex items-center justify-center dark:border-x dark:border-solid dark:border-gray-600">
                <div className="absolute inset-0 bg-black opacity-10 rounded-lg max-h-[80vh]"></div>
                <div className="flex flex-col">
                  <a href="/login" className="relative z-10">
                    <button className="bg-green-600 text-white px-2 py-1 rounded-lg font-semibold w-40 mb-2">
                      Login
                    </button>
                  </a>
                  <a href="/signup" className="relative z-10">
                    <button className="bg-yellow-400 text-white px-2 py-1 rounded-lg font-semibold w-40">
                      Signup to Unlock
                    </button>
                  </a>
                </div>
              </div>
            )}
            <div
              className={`${
                !decoded ? "blur-md pointer-events-none opacity-70" : ""
              }`}
            >
              <Shop />
            </div>
          </div>
          <div className="mx-4 w-full flex justify-center">
            <Tabs
              readComponent={
                <>
                  <CompletionBar quizPercentage={quizCompletionPercentage} />
                  {decoded && (
                    <CustomQuizForm
                      dropDownLetters={sinhalaObjects}
                      isPremium={isPremium}
                    />
                  )}
                  <div className="mt-4">
                    <Lessons
                      unitData={units}
                      readStatus={readStatus}
                      loggedIn={decoded}
                    />
                  </div>
                </>
              }
              speakComponent={
                <div className="text-center">🎤 Speak section coming soon!</div>
              }
            />
          </div>
          <div className="relative w-full flex justify-center pl-12 pr-8">
            {!decoded && (
              <div className="absolute inset-0 flex items-center justify-center max-h-[80vh] dark:border-x dark:border-solid dark:border-gray-600">
                <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
                <div className="flex flex-col">
                  <a href="/login" className="relative z-10">
                    <button className="bg-green-600 text-white px-2 py-1 rounded-lg font-semibold w-40 mb-2">
                      Login
                    </button>
                  </a>
                  <a href="/signup" className="relative z-10">
                    <button className="bg-yellow-400 text-white px-2 py-1 rounded-lg font-semibold w-40">
                      Signup to Unlock
                    </button>
                  </a>
                </div>
              </div>
            )}
            <div
              className={`${
                !decoded ? "blur-md pointer-events-none opacity-70" : ""
              }`}
            >
              <ProfileCard
                userData={
                  userData ?? {
                    username: "",
                    email: "",
                    readPercentage: 0,
                    premiumEndDate: null,
                  }
                }
                isPremium={isPremium}
              />
            </div>
          </div>
        </div>
      </div>
      <TutorialModal
        localStorageName={storageName}
        tutorialText={tutorialText}
        title={"Learn Sinhala"}
      />
    </ThemeProvider>
  );
}
