"use client";

import Logo from "@/components/Logo";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function VerificationSuccess() {
  return (
    <ThemeProvider>
      <div className="page-container">
        <Logo width={120} height={80} textSize={"text-3xl"} />
        <div className="auth-card">
          <h1 className="card-heading text-green-600 dark:text-green-500">
            Email Verified!
          </h1>
          <p className="card-text">
            Your email has been successfully verified. You can now log in and
            start using your account.
          </p>
          <a href="/login" className="btn-action mt-6 inline-block">
            Go to Login
          </a>
        </div>
      </div>
    </ThemeProvider>
  );
}
