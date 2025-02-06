import ProfileCard from "@/components/ProfileCard";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/utils/auth";
import { updatePremiumStatus } from "@/utils/checkPremium";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getQuizCompletionPercentage(userId: number): Promise<number> {
  const totalQuizzes = 74;
  const completedQuizzes = await prisma.usersOnQuizes.count({
    where: {
      userId: userId,
      status: "complete",
      quiz: {
        units: {
          some: {
            unit: {
              id: {
                gte: 1,
                lte: 13,
              },
            },
          },
        },
      },
    },
  });
  console.log(completedQuizzes);

  return (completedQuizzes / totalQuizzes) * 100;
}

export async function getUserData(user: any) {
  try {
    const readPercentage = await getQuizCompletionPercentage(user.id);

    return {
      username: user.username,
      email: user.email,
      readPercentage: Math.floor(readPercentage),
      premiumEndDate: user.premiumEndDate,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

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

  const userData = await getUserData(decoded.userId);
  console.log(userData);
  const isPremium = await updatePremiumStatus(parseInt(decoded.userId));
  return (
    <div className="flex min-h-screen flex-col mt-10">
      <div className="mx-4">
        <ProfileCard userData={userData} isPremium={isPremium} />
      </div>
    </div>
  );
}
