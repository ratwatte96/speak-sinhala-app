"use client";
import { useRouter } from "next/navigation";

export default function SignupButton() {
  const router = useRouter();

  const handleRouting = async () => {
    router.push("/signup");
  };

  return (
    <button
      className="p-2 rounded-md dark:text-white hover-transition"
      onClick={handleRouting}
    >
      Signup
    </button>
  );
}
