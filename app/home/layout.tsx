import TopNavbar from "@/components/TopNavBar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Speak Sinhala",
  description: "Website to make learning how to speak sinhala fun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token: any = cookies().get("accessToken"); // Retrieve the token from cookies

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-[#EAEAEA]">
        <TopNavbar loggedOut={!token} />
        <main className="min-h-[80vh]">{children}</main>
      </body>
    </html>
  );
}
