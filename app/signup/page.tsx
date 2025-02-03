"use client";

import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
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

    // Validate password strength
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setMessage("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setMessage("Password must contain at least one number");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setMessage("Password must contain at least one special character");
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          quizProgress: localStorage.getItem("quizProgress"),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("User created successfully!");
        setEmail("");
        setPassword("");
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("Something went wrong!");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base text-skin-base">
      <h1>Sign Up</h1>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>
      <small>
        Password must be at least 8 characters long and include at least one
        uppercase letter, one number, and one special character.
      </small>
      <button onClick={handleSignup}>Sign Up</button>
      {message && <p>{message}</p>}
    </main>
  );
}
