"use client";

import Logo from "@/components/Logo";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleLogin = async () => {
    setMessage("");

    // Client-side validation
    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Login successful!! Redirecting...");
        setEmail("");
        setPassword("");
        if (res.ok) {
          router.push(callbackUrl);
          window.location.reload(); // Forces a page reload after navigation
        }
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("Something went wrong!");
    }
  };

  return (
    <ThemeProvider>
      <main className="flex justify-center items-centers min-h-screen p-24 bg-gray-100 dark:bg-black">
        <div className="flex flex-col justify-center items-center">
          <Logo width={120} height={80} textSize={"text-3xl"} />
          <div className="p-6 bg-white shadow-lg w-80 rounded-lg text-center dark:bg-black dark:border dark:border-solid dark:border-gray-400 mt-6">
            <h1 className="text-xl font-semibold text-gray-700 dark:text-white">
              Login
            </h1>
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
                className="w-full p-2 dark:border dark:border-solid dark:border-gray-400 bg-gray-200 dark:bg-black placeholder:text-gray-500 dark:placeholder:text-white rounded-md text-center mt-1 mb-2"
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
                className="w-full p-2 dark:border dark:border-solid dark:border-gray-400 bg-gray-200 dark:bg-black placeholder:text-gray-500 dark:placeholder:text-white rounded-md text-center mt-1"
              />
            </div>
            <button
              className="mt-4 w-full bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all"
              onClick={handleLogin}
            >
              Login
            </button>
            {message && <p className="mt-1">{message}</p>}
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <LoginComponent />
    </Suspense>
  );
}
