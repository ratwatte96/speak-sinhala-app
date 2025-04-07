"use client";

import Logo from "@/components/Logo";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function VerificationEmailSent() {
  return (
    <ThemeProvider>
      <div className="page-container">
        <Logo width={120} height={80} textSize={"text-3xl"} />
        <div className="auth-card">
          <h1 className="card-heading text-green-600 dark:text-green-500">
            Verification Email Sent
          </h1>
          <p className="card-text">
            If an account with this email exists, a new verification email has
            been sent.
          </p>
          <a href="/" className="btn-action mt-6 inline-block">
            Go to Homepage
          </a>
        </div>
      </div>
    </ThemeProvider>
  );
}
