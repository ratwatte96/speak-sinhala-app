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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let token: any = cookies().get("accessToken"); // Retrieve the token from cookies

  let isPremium;
  try {
    if (token) {
      const decoded: any = verifyAccessToken(token.value);
      isPremium = await updatePremiumStatus(parseInt(decoded.userId));
    } else {
      isPremium = false;
    }
  } catch (error) {
    errorWithFile(error);
    token = false;
    isPremium = false;
  }

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-[#EAEAEA] dark:bg-black">
        <ThemeProvider>
          <TopNavbar loggedOut={!token} isPremium={isPremium} />
        </ThemeProvider>
        <main className="min-h-[80vh]">{children}</main>
      </body>
    </html>
  );
}
