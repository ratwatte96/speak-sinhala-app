"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
        router.push(data.redirect); // Redirect if needed
      } else {
        setMessage("A new verification email has been sent.");
      }
    } else {
      setError(data.error || "Something went wrong.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="p-8 bg-white shadow-lg rounded-xl text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Resend Verification Email
        </h1>
        <p className="mt-2 text-gray-600">
          Enter your email to receive a new verification link.
        </p>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="email"
            className="w-full p-2 border rounded-md"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Resend Email
          </button>
        </form>
        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
}
