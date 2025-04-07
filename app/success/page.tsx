"use client";

import Logo from "@/components/Logo";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function VerificationSuccess() {
  return (
    <ThemeProvider>
      <div className="page-container">
        <Logo width={120} height={80} textSize={"text-3xl"} />
        <div className="auth-card">
          <h1 className="text-md sm:text-xl font-semibold text-green-600 dark:text-green-500">
            Email Verified Successfully!
          </h1>
          <p className="card-text">
            Thank you for verifying your email. You can now log in to your
            account.
          </p>
          <a href="/login" className="mt-6 inline-block btn-action">
            Go to Login
          </a>
        </div>
      </div>
    </ThemeProvider>
  );
}
