"use client";
import { fetchWithToken } from "@/utils/fetch";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      const response = await fetchWithToken("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.push("/login"); // Redirect to login page
      } else {
        console.error("Failed to logout");
      }
    };

    logout();
  }, [router]);

  return <p>Logging out...</p>;
}
