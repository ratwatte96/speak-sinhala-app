"use client";

import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import Logo from "@/components/Logo";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <ThemeProvider>
      <div className="page-container">
        <Logo width={120} height={80} textSize={"text-3xl"} />
        <div className="auth-card">
          <h1 className="text-md card-heading">Something Went Wrong</h1>
          <p className="card-text">
            An unexpected error has occurred. Please try again in a few minutes.
          </p>
          <button onClick={() => router.push("/")} className="mt-4 btn-action">
            Go Home
          </button>
        </div>
      </div>
    </ThemeProvider>
  );
}
