"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    setMessage("");

    // Client-side validation
    if (!username || !email || !password) {
      setMessage("All fields are required.");
      return;
    }

    // Validate username (at least 3 characters, no special characters)
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    if (!usernameRegex.test(username)) {
      setMessage(
        "Username must be at least 3 characters and contain only letters, numbers, or underscores."
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setMessage("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setMessage("Password must contain at least one number.");
      return;
    }
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      setMessage("Password must contain at least one special character.");
      return;
    }

    try {
      setMessage("Signing up, please wait...");

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          quizProgress: localStorage.getItem("quizProgress"),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "User created successfully!");
        setUsername("");
        setEmail("");
        setPassword("");
        setTimeout(() => {
          setMessage("Redirecting...");
          router.push(`/login`);
        }, 2000);
      } else {
        setMessage(data.error || "Signup failed.");
      }
    } catch (error) {
      setMessage("Something went wrong!");
    }
  };

  return (
    <ThemeProvider>
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 dark:bg-black">
        <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg dark:bg-black dark:border dark:border-gray-400 text-center w-80">
          <h1 className="text-md sm:text-xl font-semibold text-gray-800 dark:text-white">
            Sign Up
          </h1>

          <div className="mt-4 text-left">
            <label className="block text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="mt-4 text-left">
            <label className="block text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="mt-4 text-left">
            <label className="block text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <small className="text-gray-500 dark:text-gray-400 mt-2 block">
            Password must be at least 8 characters long and include at least one
            uppercase letter, one number, and one special character.
          </small>

          <button
            onClick={handleSignup}
            className="mt-4 w-full bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all"
          >
            Sign Up
          </button>

          {message && (
            <p className="mt-4 text-red-600 dark:text-red-400">{message}</p>
          )}
        </div>
      </main>
    </ThemeProvider>
  );
}
