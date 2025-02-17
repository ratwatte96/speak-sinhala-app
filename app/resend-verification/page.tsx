"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import Logo from "@/components/Logo";

export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const res = await fetch("/api/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      if (data.redirect) {
        router.push(data.redirect);
      } else {
        setMessage("A new verification email has been sent.");
      }
    } else {
      setError(data.error || "Something went wrong.");
    }
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
        <Logo width={120} height={80} textSize={"text-3xl"} />
        <div className="p-6 bg-white shadow-lg rounded-lg text-center dark:bg-black dark:border dark:border-solid dark:border-gray-400 w-80 mt-6">
          <h1 className="text-md sm:text-xl font-semibold text-gray-800 dark:text-white">
            Resend Verification Email
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Enter your email to receive a new verification link.
          </p>
          <form onSubmit={handleSubmit} className="mt-4">
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="mt-4 w-full bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all"
            >
              Resend Email
            </button>
          </form>
          {message && (
            <p className="mt-4 text-green-600 dark:text-green-400">{message}</p>
          )}
          {error && (
            <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}
