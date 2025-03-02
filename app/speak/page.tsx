import BottomNavbar from "@/components/BottomNavbar";
import { SharedStateProvider } from "@/components/StateProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import TopNavbar from "@/components/TopNavBar";
import { verifyAccessToken } from "@/utils/auth";
import { updatePremiumStatus } from "@/utils/checkPremium";
import { errorWithFile } from "@/utils/logger";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Learn Sinhala",
  description: "Website to make learning how to read and speak sinhala fun",
};

export default async function Speak() {
  const token: any = cookies().get("accessToken"); // Retrieve the token from cookies
  let isPremium = false;
  let decoded: any;
  try {
    if (token) {
      decoded = verifyAccessToken(token.value);
      isPremium = await updatePremiumStatus(parseInt(decoded.userId));
    } else {
      isPremium = false;
    }
  } catch (error) {
    errorWithFile(error);
  }
  return (
    <SharedStateProvider>
      <ThemeProvider>
        <TopNavbar loggedOut={!decoded} isPremium={isPremium} />
        <div className="flex min-h-screen flex-col pb-24 animate-fadeIn bg-[#EAEAEA] dark:bg-black">
          <div className="mx-6 mt-10 ">
            <div className="relative w-full h-3 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400 dark:bg-gray-500 transition-all duration-100"
                style={{ width: `0%` }}
              ></div>

              <div className="absolute inset-0 flex items-center justify-center text-xs text-black dark:text-white font-semibold">
                0%
              </div>
            </div>

            <div className="text-center h-96 flex items-center justify-center text-lg">
              🎤 Speak section coming soon!
            </div>
          </div>
        </div>
        <BottomNavbar />
      </ThemeProvider>
    </SharedStateProvider>
  );
}
