"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton({ loggedIn }: { loggedIn: boolean }) {
  const router = useRouter();

  const handleRouting = async () => {
    const route = loggedIn ? "logout" : "login";
    router.push(`/${route}`);
  };

  return (
    <button
      className="p-2 rounded-md border border-solid border-gray-300 dark:bg-black dark:text-white transition-transform transform hover:scale-105 hover:shadow-lg"
      onClick={handleRouting}
    >
      {loggedIn ? "Logout" : "Login"}
    </button>
  );
}
