"use client";
import { fetchWithToken } from "@/utils/fetch";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    router.push("/logout");
  };

  return (
    <button
      className="p-2 rounded-md border border-solid border-gray-300 dark:bg-black dark:text-white transition-transform transform hover:scale-105 hover:shadow-lg"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
