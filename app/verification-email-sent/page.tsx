"use client";

import { ThemeProvider } from "@/components/ThemeProvider";

export default function VerificationEmailSent() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen items-center justify-center bg-green-50 dark:bg-black">
        <div className="p-6 bg-white shadow-lg rounded-lg text-center dark:bg-black dark:border dark:border-solid dark:border-gray-400 w-80">
          <h1 className="text-md sm:text-xl font-semibold text-green-600 dark:text-green-500">
            Verification Email Sent
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            If an account with this email exists, a new verification email has
            been sent.
          </p>
          <a
            href="/"
            className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    </ThemeProvider>
  );
}
