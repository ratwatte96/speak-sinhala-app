"use client";

//!Refactor

import { useState } from "react";
import Image from "next/image";
import { fetchWithToken } from "@/utils/fetch";
import { Star } from "lucide-react";
import XPStats from "./XPStats";

interface ProfileCardProps {
  userData: any;
  isPremium: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ userData, isPremium }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailReminders, setEmailReminders] = useState(userData.emailReminders);
  const [updatingPreference, setUpdatingPreference] = useState(false);
  const [preferenceMessage, setPreferenceMessage] = useState("");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    // Validate password strength
    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setMessage("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setMessage("Password must contain at least one number");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setMessage("Password must contain at least one special character");
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetchWithToken("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(data.error || "Something went wrong.");
      }
      setChangingPassword(false);
    } catch (error) {
      setChangingPassword(false);
      setMessage("Error updating password.");
    }
  };

  const handleForgotPassword = async () => {
    setSendingEmail(true);
    try {
      const response = await fetchWithToken("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setForgotMessage("Password reset email sent!");
      } else {
        setForgotMessage(data.error || "Something went wrong.");
      }
      setSendingEmail(false);
    } catch (error) {
      setSendingEmail(false);

      setForgotMessage("Error sending reset email.");
    }
  };

  const handleEmailReminderToggle = async () => {
    setUpdatingPreference(true);
    try {
      const response = await fetchWithToken("/api/update-email-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailReminders: !emailReminders }),
      });

      const data = await response.json();
      if (response.ok) {
        setEmailReminders(!emailReminders);
        setPreferenceMessage("Email preference updated successfully!");
        setTimeout(() => setPreferenceMessage(""), 3000);
      } else {
        setPreferenceMessage(data.error || "Failed to update preference");
        setTimeout(() => setPreferenceMessage(""), 3000);
      }
    } catch (error) {
      setPreferenceMessage("Error updating preference");
      setTimeout(() => setPreferenceMessage(""), 3000);
    }
    setUpdatingPreference(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-auto mb-20">
      <div className="flex-col-center h-auto">
        <div className="rounded-lg text-center ">
          <div className="relative w-[80px] h-[80px] mx-auto">
            <Image
              src={
                userData.gender === "male" ? "/avatarMale.webp" : "/avatar.webp"
              }
              alt="User Avatar"
              width={80}
              height={80}
              className="rounded-full"
            />
            {isPremium && (
              <Star
                className="absolute top-0 right-0 text-yellow-500"
                size={24}
                fill="currentColor"
              />
            )}
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold">{userData.username}</h2>
            <p className="text-gray-500">{userData.email}</p>
          </div>
          {isPremium && (
            <p className="text-sm text-gray-500">
              {userData.premiumEndDate
                ? `Premium Until: ${formatDate(userData.premiumEndDate)}`
                : "Lifetime Premium"}
            </p>
          )}
          <div className="flex justify-between mt-4">
            <div className="flex flex-col justify-around bg-gray-300 dark:bg-black dark-base-border dark:border-gray-600 p-2 rounded-md w-1/2 mx-1 text-center">
              <p className="text-sm">Reading Completion</p>
              <p className="text-lg font-bold">{`${userData.readPercentage}%`}</p>
            </div>
            <div className="relative bg-gray-300 dark:bg-black dark-base-border dark:border-gray-600 p-2 rounded-md w-1/2 mx-1 text-center">
              <p className="text-sm">Speaking Completion</p>
              <p className="text-lg font-bold">0%</p>
              <div className="absolute bottom-0 right-0 bg-yellow-500 text-[7px] text-black px-1.5 py-0.5 rounded-bl-sm shadow-md">
                Coming Soon
              </div>
            </div>
          </div>
          <XPStats isLoggedIn={true} />
          {/* Email Reminder Toggle */}
          <div className="mt-4 flex items-center justify-between bg-gray-300 dark:bg-black dark-base-border dark:border-gray-600 p-4 rounded-md">
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">Daily Email Reminders</span>
              <span className="text-xs text-gray-500">
                Get daily practice reminders
              </span>
            </div>
            <button
              onClick={handleEmailReminderToggle}
              disabled={updatingPreference}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                emailReminders ? "bg-green-500" : "bg-gray-400"
              }`}
              role="switch"
              aria-checked={emailReminders}
            >
              <span
                className={`${
                  emailReminders ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>
          {preferenceMessage && (
            <p className="text-sm text-green-500 mt-2">{preferenceMessage}</p>
          )}
          {/* Change Password Form */}
          {isForgotPassword ? (
            <div className="mt-4">
              {forgotMessage && (
                <p className="text-sm text-red-500 mt-2">{forgotMessage}</p>
              )}
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={handleForgotPassword}
                  className="btn-yellow w-full p-2 rounded-md"
                >
                  {sendingEmail ? "Sending" : "Send Reset Email"}
                </button>
                <button
                  onClick={() => setIsForgotPassword(false)}
                  className="btn-red w-full p-2 rounded-md"
                >
                  Back
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-4">
                <input
                  type="password"
                  placeholder="Enter Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="form-input"
                />
                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input mt-2"
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
                <p className="text-sm text-red-500 mt-2">{message}</p>
              )}
              <div className="mt-4 flex space-x-2">
                <button
                  className="btn-primary w-1/2 p-2 rounded-md"
                  onClick={handleChangePassword}
                >
                  {changingPassword ? "Updating..." : "Update Password"}
                </button>
                <button
                  onClick={() => setIsForgotPassword(true)}
                  className="btn-yellow w-1/2 p-2 rounded-md"
                >
                  Forgot Password
                </button>
              </div>
            </>
          )}

          <div className="relative inline-block w-full mt-2">
            <button
              className="bg-gray-400 text-white w-full py-2 rounded-md opacity-50 cursor-not-allowed"
              disabled
            >
              Invite Friends
            </button>
            <div className="absolute bottom-0 right-0 bg-yellow-500 text-[8px] text-black px-1.5 py-0.5 rounded-bl-sm shadow-md">
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
