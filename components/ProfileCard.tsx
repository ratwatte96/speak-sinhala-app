"use client";

import { useState } from "react";
import Image from "next/image";
import { fetchWithToken } from "@/utils/fetch";

interface ProfileCardProps {
  userData: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ userData }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);

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
    } catch (error) {
      setMessage("Error updating password.");
    }
  };

  const handleForgotPassword = async () => {
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
    } catch (error) {
      setForgotMessage("Error sending reset email.");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      <div className="p-6 rounded-lg w-80 text-center">
        <Image
          src="/avatar.webp"
          alt="User Avatar"
          width={80}
          height={80}
          className="rounded-full mx-auto"
        />
        <h2 className="text-lg font-bold mt-4">{userData.username}</h2>
        <p className="text-gray-500 text-sm">{userData.email}</p>
        <div className="flex justify-between mt-4">
          <div className="bg-gray-300 p-2 rounded-md w-1/2 mx-1 text-center">
            <p className="text-sm">Reading Completion</p>
            <p className="text-lg font-bold">{`${userData.readPercentage}%`}</p>
          </div>
          <div className="relative bg-gray-200 p-2 rounded-md w-1/2 mx-1 text-center">
            <p className="text-sm">Speaking Completion</p>
            <p className="text-lg font-bold">0%</p>
            <div className="absolute bottom-0 right-0 bg-yellow-500 text-[7px] text-black px-1.5 py-0.5 rounded-bl-sm shadow-md">
              Coming Soon
            </div>
          </div>
        </div>
        {/* Change Password Form */}
        {isForgotPassword ? (
          <div className="mt-4">
            {forgotMessage && (
              <p className="text-sm text-red-500 mt-2">{forgotMessage}</p>
            )}
            <div className="mt-4 flex space-x-2">
              <button
                onClick={handleForgotPassword}
                className="bg-yellow-400 text-black w-full p-2 rounded-md"
              >
                Send Reset Email
              </button>
              <button
                onClick={() => setIsForgotPassword(false)}
                className="bg-gray-400 text-white w-full p-2 rounded-md"
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
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 border rounded-md text-center"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded-md text-center mt-2"
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
              <button className="bg-green-500 text-white w-1/2 p-2 rounded-md">
                Update Password
              </button>
              <button
                onClick={() => setIsForgotPassword(true)}
                className="bg-yellow-400 text-black w-1/2 p-2 rounded-md"
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
  );
};

export default ProfileCard;
