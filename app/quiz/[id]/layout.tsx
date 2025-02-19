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
    errorWithFile(error);
  }

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <TopNavbar
            loggedOut={!loggedIn}
            isPremium={isPremium}
            showValues={false}
          />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
