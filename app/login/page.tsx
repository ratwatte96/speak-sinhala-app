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
      <main className="page-container">
        <div className="flex flex-col justify-center items-center">
          <Logo width={120} height={80} textSize={"text-3xl"} />
          <div className="auth-card">
            <h1 className="card-heading">Login</h1>
            <div className="mt-4 text-left">
              <label className="form-label">Username or Email</label>
              <input
                type="email"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="Enter your username/email"
                required
                className="form-input mb-2"
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
            {loggedIn ? (
              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                className="btn-secondary mt-4"
              >
                Start Learning
              </button>
            ) : (
              <button className="btn-action mt-4" onClick={handleLogin}>
                Login
              </button>
            )}
            {message && <p className="card-text">{message}</p>}
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
