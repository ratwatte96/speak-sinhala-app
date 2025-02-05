import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SharedStateProvider } from "@/components/StateProvider";

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
  return (
    <html lang="en">
      <SharedStateProvider>
        <body className={inter.className}>{children}</body>
      </SharedStateProvider>
    </html>
  );
}
