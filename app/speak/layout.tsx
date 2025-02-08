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
  let isPremium;
  try {
    if (token) {
      const decoded: any = verifyAccessToken(token.value);
      isPremium = await updatePremiumStatus(parseInt(decoded.userId));
    } else {
      isPremium = false;
    }
  } catch (error) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/speak")}`);
  }

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-[#EAEAEA]">
        <TopNavbar loggedOut={!token} isPremium={isPremium} />
        <main className="min-h-[80vh]">{children}</main>
        <BottomNavbar />
      </body>
    </html>
  );
}
