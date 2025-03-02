import Shop from "@/components/ShopComponent";
import BottomNavbar from "@/components/BottomNavbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import TopNavbar from "@/components/TopNavBar";
import { verifyAccessToken } from "@/utils/auth";
import { errorWithFile } from "@/utils/logger";
import { cookies } from "next/headers";
import { SharedStateProvider } from "@/components/StateProvider";
import { updatePremiumStatus } from "@/utils/checkPremium";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn Sinhala",
  description: "Website to make learning how to read and speak sinhala fun",
};

export default async function ShopPage() {
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
        <TopNavbar isPremium={isPremium} loggedOut={!decoded} />
        <div className="flex min-h-screen flex-col  bg-[#EAEAEA] dark:bg-black animate-fadeIn">
          <div className="mx-6 mt-4">
            {!decoded && (
              <div className="absolute inset-0 flex items-center justify-center dark:border-x dark:border-solid dark:border-gray-600">
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
              <Shop />
            </div>
          </div>
        </div>
        <BottomNavbar />
      </ThemeProvider>
    </SharedStateProvider>
  );
}
