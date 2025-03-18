"use client";

import Logo from "@/components/Logo";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginComponent() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async () => {
    setMessage("");

    // Client-side validation
    if (!emailOrUsername || !password) {
      setMessage("Email and password are required");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Login successful!! Click the start learning button...");
        setEmailOrUsername("");
        setPassword("");
        setLoggedIn(true);
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
              <label className="block text-gray-700 dark:text-gray-300 text-sm">
                Username or Email
              </label>
              <input
                type="email"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="Enter your username/email"
                required
                className="w-full p-2 dark:border dark:border-solid dark:border-gray-400 bg-gray-200 dark:bg-black placeholder:text-gray-500 dark:placeholder:text-white rounded-md text-center mt-1 mb-2 placeholder:text-sm"
              />
            </div>
            <div className="mt-4 text-left">
              <label className="block text-gray-700 dark:text-gray-300 text-sm">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full p-2 dark:border dark:border-solid dark:border-gray-400 bg-gray-200 dark:bg-black placeholder:text-gray-500 dark:placeholder:text-white rounded-md text-center mt-1 placeholder:text-sm"
              />
            </div>
            {loggedIn ? (
              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                className="mt-4 w-full bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition-all"
              >
                Start Learning
              </button>
            ) : (
              <button
                className="mt-4 w-full bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all"
                onClick={handleLogin}
              >
                Login
              </button>
            )}
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
