import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SharedStateProvider } from "@/components/StateProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learn Sinhala",
  description: "Website to make learning how to read and speak sinhala fun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SharedStateProvider>
        <body className="bg-[#EAEAEA]">{children}</body>
      </SharedStateProvider>
    </html>
  );
}
