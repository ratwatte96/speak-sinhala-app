import type { Metadata } from "next";
import "./globals.css";
import { SharedStateProvider } from "@/components/StateProvider";

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
