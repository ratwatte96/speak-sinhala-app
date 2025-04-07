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
      <main className="page-container">
        <Logo width={120} height={80} textSize={"text-3xl"} />
        <div className="auth-card">
          <h1 className="card-heading">Sign Up</h1>

          <div className="mt-4 text-left">
            <label className="form-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              className="form-input"
            />
          </div>

          <div className="mt-4 text-left">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="form-input"
            />
          </div>

          <div className="mt-4 text-left">
            <label className="form-label">Gender</label>
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
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="form-input"
            />
          </div>

          <small className="card-text mt-2 block">
            Password must be at least 8 characters long and include at least one
            uppercase letter, one number, and one special character.
          </small>

          <button
            onClick={handleSignup}
            className={`${loading ? "btn-secondary" : "btn-action"} mt-4`}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {message && (
            <p className="card-text mt-4 text-red-600 dark:text-red-400">
              {message}
            </p>
          )}
        </div>
      </main>
    </ThemeProvider>
  );
}
