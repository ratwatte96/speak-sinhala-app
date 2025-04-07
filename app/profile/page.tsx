import ProfileCard from "@/components/ProfileCard";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/utils/auth";
import { updatePremiumStatus } from "@/utils/checkPremium";
import { errorWithFile } from "@/utils/logger";
import { getUserData } from "@/utils/random";
import { cookies } from "next/headers";
import BottomNavbar from "@/components/BottomNavbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import TopNavbar from "@/components/TopNavBar";
import { SharedStateProvider } from "@/components/StateProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn Sinhala",
  description: "Website to make learning how to read and speak sinhala fun",
};

export default async function UserProfile() {
  const token: any = cookies().get("accessToken"); // Retrieve the token from cookies

  let decoded: any;
  let user: any;
  let userData: any = {};
  let isPremium = false;

  try {
    if (token) {
      decoded = verifyAccessToken(token?.value);
      isPremium = await updatePremiumStatus(parseInt(decoded.userId));
      user = await prisma.user.findUnique({
        where: { id: parseInt(decoded.userId) },
        include: { lives: true },
      });
      userData = await getUserData(user);
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
        <div className="flex min-h-screen flex-col animate-fadeIn bg-[#EAEAEA] dark:bg-black">
          <div className="mx-6 mt-10 flex justify-center">
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
              <ProfileCard userData={userData} isPremium={isPremium} />
            </div>
          </div>
        </div>
        <BottomNavbar />
      </ThemeProvider>
    </SharedStateProvider>
  );
}
