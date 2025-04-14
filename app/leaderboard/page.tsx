import { verifyAccessToken } from "@/utils/auth";
import { updatePremiumStatus } from "@/utils/checkPremium";
import { errorWithFile } from "@/utils/logger";
import { cookies } from "next/headers";
import BottomNavbar from "@/components/BottomNavbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import TopNavbar from "@/components/TopNavBar";
import { SharedStateProvider } from "@/components/StateProvider";
import LeaderboardDisplay from "@/components/leaderboard/LeaderboardDisplay";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard - Learn Sinhala",
  description: "View daily and all-time rankings for Sinhala language learners",
};

export default async function LeaderboardPage() {
  const token: any = cookies().get("accessToken");
  let isPremium = false;
  let decoded: any;

  try {
    if (token) {
      decoded = verifyAccessToken(token.value);
      isPremium = await updatePremiumStatus(parseInt(decoded.userId));
    }
  } catch (error) {
    errorWithFile(error);
  }

  return (
    <SharedStateProvider>
      <ThemeProvider>
        <TopNavbar loggedOut={!decoded} isPremium={isPremium} />
        <div className="flex min-h-screen flex-col bg-[#EAEAEA] dark:bg-black animate-fadeIn">
          <div className="mx-6 mt-10">
            {!decoded && (
              <div className="absolute inset-0 flex-center dark:border-x dark:border-solid dark:border-gray-600">
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
              <LeaderboardDisplay />
            </div>
          </div>
        </div>
        <BottomNavbar />
      </ThemeProvider>
    </SharedStateProvider>
  );
}
