import React from "react";
import { CustomQuiz } from "@/components/CustomQuiz";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAccessToken } from "@/utils/auth";
import { updatePremiumStatus } from "@/utils/checkPremium";
import { ThemeProvider } from "@/components/ThemeProvider";
import { errorWithFile } from "@/utils/logger";
import TopNavbar from "@/components/TopNavBar";
import { SharedStateProvider } from "@/components/StateProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn Sinhala",
  description: "Website to make learning how to read and speak sinhala fun",
};

export default async function CustomQuizPage({
  searchParams,
}: {
  searchParams: { letters?: string };
}) {
  const callbackUrl = "read";
  const token: any = cookies().get("accessToken");

  if (!token) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  let loggedIn = false;
  let isPremium = false;
  try {
    const decoded: any = verifyAccessToken(token.value);
    isPremium = await updatePremiumStatus(parseInt(decoded.userId));
    loggedIn = decoded;
  } catch (error) {
    errorWithFile(error);
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  if (!isPremium) {
    //! do basic need premium page
    redirect(`/`);
  }

  const encodedLetters = searchParams.letters;
  const letters = encodedLetters
    ? JSON.parse(decodeURIComponent(encodedLetters))
    : [];

  return (
    <SharedStateProvider>
      <ThemeProvider>
        <TopNavbar
          loggedOut={!loggedIn}
          isPremium={isPremium}
          showValues={false}
        />
        <CustomQuiz letters={letters} isPremium={isPremium} />
      </ThemeProvider>
    </SharedStateProvider>
  );
}
