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
      className="p-2 rounded-md dark:text-white hover-transition"
      onClick={handleRouting}
    >
      {loggedIn ? "Logout" : "Login"}
    </button>
  );
}
