import Shop from "@/components/ShopComponent";
import { ThemeProvider } from "@/components/ThemeProvider";
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
    <ThemeProvider>
      <div className="flex min-h-screen flex-col  bg-[#EAEAEA] dark:bg-black">
        <div className="mx-4 mt-10">
          <Shop />
        </div>
      </div>
    </ThemeProvider>
  );
}
