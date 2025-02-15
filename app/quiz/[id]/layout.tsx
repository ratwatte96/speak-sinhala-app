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
  const token: any = cookies().get("accessToken"); // Retrieve the token from cookies
  let isPremium = false;
  let loggedIn = false;

  try {
    if (token) {
      const decoded: any = verifyAccessToken(token.value);
      isPremium = await updatePremiumStatus(parseInt(decoded.userId));
      loggedIn = true;
    }
  } catch (error) {
    console.log("quiz/[id]/layout.tsx", error);
  }

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-[#EAEAEA] dark:bg-black">
        <TopNavbar loggedOut={!loggedIn} isPremium={isPremium} />
        <main>{children}</main>
      </body>
    </html>
  );
}
