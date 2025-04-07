"use client";

import Logo from "@/components/Logo";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function VerificationError() {
  return (
    <ThemeProvider>
      <div className="page-container">
        <Logo width={120} height={80} textSize={"text-3xl"} />
        <div className="auth-card">
          <h1 className="card-heading text-red-600 dark:text-red-500">
            Verification Failed
          </h1>
          <p className="card-text">
            The verification link is invalid or has expired. Please request a
            new verification email.
          </p>
          <a
            href="/resend-verification"
            className="btn-danger mt-6 inline-block"
          >
            Resend Verification Email
          </a>
        </div>
      </div>
    </ThemeProvider>
  );
}
