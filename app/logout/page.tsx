"use client";
import { fetchWithToken } from "@/utils/fetch";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import Logo from "@/components/Logo";

export default function LogoutPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Logging out...");
  const [error, setError] = useState("");
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetchWithToken("/api/logout", {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          setMessage("You have been logged out successfully.");
          setIsLoggedOut(true);
        } else {
          const data = await response.json();
          setError(data.error || "Failed to logout. Please try again.");
        }
      } catch (err) {
        setError("Something went wrong. Please check your connection.");
      }
    };

    logout();
  }, []);

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 dark:bg-black">
        <Logo width={120} height={80} textSize={"text-3xl"} />
        <div className="p-6 bg-white shadow-lg rounded-lg text-center dark:bg-black dark:border dark:border-solid dark:border-gray-400 mt-6">
          <h1 className="text-md sm:text-xl font-semibold text-gray-700 dark:text-white">
            {error ? "Logout Failed" : message}
          </h1>

          {error && <p className="text-sm mt-4 text-red-600">{error}</p>}

          {isLoggedOut && (
            <button
              onClick={() => router.push("/login")}
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}
