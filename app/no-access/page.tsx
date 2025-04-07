"use client";
import Logo from "@/components/Logo";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useRouter } from "next/navigation";

export default function NoAccessPage() {
  const router = useRouter();

  return (
    <ThemeProvider>
      <div className="page-container bg-gray-100">
        <Logo width={120} height={80} textSize={"text-3xl"} />
        <div className="auth-card">
          <h1 className="text-md sm:text-xl font-semibold text-red-600 dark:text-red-500">
            Access Denied
          </h1>
          <p className="mt-4 card-text">
            You don&apos;t have access to this quiz. Please check your account
            or try a different quiz.
          </p>
          <button onClick={() => router.push("/")} className="mt-6 btn-danger">
            Go to Homepage
          </button>
        </div>
      </div>
    </ThemeProvider>
  );
}
