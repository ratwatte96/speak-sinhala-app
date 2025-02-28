"use client";

import Dropdown from "@/components/Dropdown";
import Logo from "@/components/Logo";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("");

  const handleSignup = async () => {
    setMessage("");
    setLoading(true);
    try {
      setMessage("Validating details...");
      const validateRes = await fetch("/api/signup/validate-user-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, gender }),
      });

      if (!validateRes.ok) {
        throw new Error((await validateRes.json()).error);
      }

      setMessage("Creating account...");
      const createUserRes = await fetch("/api/signup/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          gender,
          streak: localStorage.getItem("streak"),
        }),
      });

      if (!createUserRes.ok) {
        throw new Error((await createUserRes.json()).error);
      }

      const { userId, verificationToken } = await createUserRes.json();

      setMessage("Setting up quiz progress...");
      const quizRes = await fetch("/api/signup/create-user-quiz-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          quizProgress: localStorage.getItem("quizProgress"),
        }),
      });

      if (!quizRes.ok) {
        throw new Error((await quizRes.json()).error);
      }

      setMessage("Sending verification email...");
      const emailRes = await fetch("/api/signup/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verificationToken }),
      });

      if (!emailRes.ok) {
        throw new Error((await emailRes.json()).error);
      }

      setMessage("Signup successful! Redirecting...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      if (error?.name === "AbortError") {
        setMessage("Request timed out. Please try again.");
      } else {
        setMessage(error?.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 dark:bg-black">
        <Logo width={120} height={80} textSize={"text-3xl"} />
        <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg dark:bg-black dark:border dark:border-solid dark:border-gray-400 text-center w-80 mt-6">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
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
              className="w-full p-2 dark:border dark:border-solid dark:border-gray-400 bg-gray-200 dark:bg-black placeholder:text-gray-500 dark:placeholder:text-white rounded-md text-center mt-1"
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
              className="w-full p-2 dark:border dark:border-solid dark:border-gray-400 bg-gray-200 dark:bg-black placeholder:text-gray-500 dark:placeholder:text-white rounded-md text-center mt-1"
            />
          </div>

          <div className="mt-4 text-left">
            <label className="block text-gray-700 dark:text-gray-300">
              Gender
            </label>
            <Dropdown
              id={"gender"}
              buttonLabel={"Select Gender"}
              items={[
                { name: "Male", value: "male" },
                { name: "Female", value: "female" },
              ]}
              selectedItem={gender}
              setSelectedItem={setGender}
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

          <small className="text-gray-500 dark:text-gray-400 mt-2 block">
            Password must be at least 8 characters long and include at least one
            uppercase letter, one number, and one special character.
          </small>

          <button
            onClick={handleSignup}
            className={`mt-4 w-full ${
              loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
            } text-white px-6 py-2 rounded-md transition-all`}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {message && (
            <p className="mt-4 text-red-600 dark:text-red-400">{message}</p>
          )}
        </div>
      </main>
    </ThemeProvider>
  );
}
