import ProfileCard from "@/components/ProfileCard";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/utils/auth";
import { updatePremiumStatus } from "@/utils/checkPremium";
import { getUserData } from "@/utils/random";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserProfile() {
  const callbackUrl = "/user-profile";
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
  const user: any = await prisma.user.findUnique({
    where: { id: parseInt(decoded.userId) },
    include: { lives: true },
  });
  const userData = await getUserData(user);
  const isPremium = await updatePremiumStatus(user.id);
  return (
    <div className="flex min-h-screen flex-col mt-10">
      <div className="mx-4 flex justify-center">
        <ProfileCard userData={userData} isPremium={isPremium} />
      </div>
    </div>
  );
}
