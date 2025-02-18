import BottomNavbar from "@/components/BottomNavbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import TopNavbar from "@/components/TopNavBar";
import { verifyAccessToken } from "@/utils/auth";
import { updatePremiumStatus } from "@/utils/checkPremium";
import { errorWithFile } from "@/utils/logger";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learn Sinhala",
  description: "Website to make learning how to read and speak sinhala fun",
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
    errorWithFile(error);
  }

  return (
    <html lang="en">
      <body className="flex min-w-screen min-h-screen flex-col bg-[#EAEAEA] dark:bg-black">
        <ThemeProvider>
          <TopNavbar loggedOut={!decoded} isPremium={isPremium} />
        </ThemeProvider>
        <main className="min-h-[80vh]">{children}</main>
        <ThemeProvider>
          <BottomNavbar />
        </ThemeProvider>
      </body>
    </html>
  );
}
