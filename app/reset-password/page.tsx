"use client";

import { Suspense, useState } from "react";
import { useSearchParams, redirect } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import Logo from "@/components/Logo";

const ResetPasswordComponent = () => {
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

    // Password strength validation
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
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(newPassword)) {
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
        redirect("/profile");
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Error resetting password.");
    }
  };

  return (
    <div className="page-container">
      <Logo width={120} height={80} textSize={"text-3xl"} />
      <div className="auth-card">
        <h2 className="card-heading">Reset Password</h2>
        <div className="mt-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-input"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input mt-2"
          />
        </div>
        {message && (
          <p className="card-text text-red-600 dark:text-red-400">{message}</p>
        )}
        <div className="mt-4">
          <button onClick={handleResetPassword} className="btn-action">
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ResetPasswordPage() {
  return (
    <ThemeProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <ResetPasswordComponent />
      </Suspense>
    </ThemeProvider>
  );
}
