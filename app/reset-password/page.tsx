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
        redirect("/user-profile");
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Error resetting password.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
      <Logo width={120} height={80} textSize={"text-3xl"} />
      <div className="p-6 bg-white shadow-lg rounded-lg text-center dark:bg-black dark:border dark:border-solid dark:border-gray-400 w-80 mt-6">
        <h2 className="text-md sm:text-xl font-semibold text-gray-800 dark:text-white">
          Reset Password
        </h2>
        <div className="mt-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-center mt-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>
        {message && (
          <p className="text-sm mt-2 text-red-600 dark:text-red-400">
            {message}
          </p>
        )}
        <div className="mt-4">
          <button
            onClick={handleResetPassword}
            className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-all"
          >
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
