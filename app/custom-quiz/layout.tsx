import { ThemeProvider } from "@/components/ThemeProvider";
import TopNavbar from "@/components/TopNavBar";
import { verifyAccessToken } from "@/utils/auth";
import { updatePremiumStatus } from "@/utils/checkPremium";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

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
    console.log("quiz/[id]/layout.tsx", error);
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
        </ThemeProvider>
        <main>{children}</main>
      </body>
    </html>
  );
}
