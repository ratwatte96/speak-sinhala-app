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
      <div className="page-container">
        <Logo width={120} height={80} textSize={"text-3xl"} />
        <div className="auth-card">
          <h1 className="card-heading">Resend Verification Email</h1>
          <p className="card-text">
            Enter your email to receive a new verification link.
          </p>
          <form onSubmit={handleSubmit} className="mt-4">
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-action mt-4">
              Resend Email
            </button>
          </form>
          {message && (
            <p className="card-text text-green-600 dark:text-green-400">
              {message}
            </p>
          )}
          {error && (
            <p className="card-text text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}
