"use client";

import { useState } from "react";
import { useSearchParams, redirect } from "next/navigation";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    // Validate password strength
    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setMessage("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setMessage("Password must contain at least one number.");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setMessage("Password must contain at least one special character.");
      return;
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successfully! Redirecting...");
        redirect("/user-profile");
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Error resetting password.");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      <div className="p-6 rounded-lg w-80 text-center">
        <h2 className="text-lg font-bold">Reset Password</h2>
        <div className="mt-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded-md text-center"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded-md text-center mt-2"
          />
        </div>
        {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleResetPassword}
            className="bg-green-500 text-white w-full p-2 rounded-md"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
