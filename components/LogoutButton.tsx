"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      router.push("/login");
    } else {
      console.error("Failed to logout");
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
