import BottomNavbar from "@/components/BottomNavbar";
import TopNavbar from "@/components/TopNavBar";
import { verifyAccessToken } from "@/utils/auth";
import { updatePremiumStatus } from "@/utils/checkPremium";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Speak Sinhala",
  description: "Website to make learning how to speak sinhala fun",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //!GET ACCESS TOKEN TO CHECK IF LOGGED OUT
  const token: any = cookies().get("accessToken"); // Retrieve the token from cookies
  let isPremium = false;
  let decoded: any;
  try {
    if (token) {
      decoded = verifyAccessToken(token.value);
      isPremium = await updatePremiumStatus(parseInt(decoded.userId));
    }
  } catch (error) {
    console.log(error);
  }

  return (
    <html lang="en">
      <body className="flex min-w-screen min-h-screen flex-col bg-[#EAEAEA] dark:bg-black">
        <TopNavbar loggedOut={!decoded} isPremium={isPremium} />
        <main className="min-h-[80vh]">{children}</main>
        <BottomNavbar />
      </body>
    </html>
  );
}
