import Shop from "@/components/ShopComponent";
import { verifyAccessToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function ShopPage() {
  const callbackUrl = "/shop";
  const token: any = cookies().get("accessToken"); // Retrieve the token from cookies

  if (!token) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  let decoded: any;
  try {
    decoded = verifyAccessToken(token.value);
  } catch (error) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return (
    <div className="flex min-h-screen flex-col mt-10">
      <div className="mx-4">
        <Shop />
      </div>
    </div>
  );
}
