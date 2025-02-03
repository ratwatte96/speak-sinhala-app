"use client";

import { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    setMessage("");

    // Client-side validation
    if (!username || !email || !password) {
      setMessage("All fields are required");
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
          username,
          email,
          password,
          quizProgress: localStorage.getItem("quizProgress"),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("User created successfully!");
        setUsername("");
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
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-skin-base text-skin-base">
      <h1 className="text-2xl font-bold">Sign Up</h1>

      <div className="mt-4">
        <label className="block">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          required
          className="border rounded-md p-2 w-80"
        />
      </div>

      <div className="mt-4">
        <label className="block">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="border rounded-md p-2 w-80"
        />
      </div>

      <div className="mt-4">
        <label className="block">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className="border rounded-md p-2 w-80"
        />
      </div>

      <small className="text-gray-500 mt-2">
        Password must be at least 8 characters long and include at least one
        uppercase letter, one number, and one special character.
      </small>

      <button
        onClick={handleSignup}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md"
      >
        Sign Up
      </button>

      {message && <p className="mt-4 text-red-500">{message}</p>}
    </main>
  );
}
