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
    where: {
      id: parseInt(decoded.userId),
    },
    include: {
      lives: true,
    },
  });

  const { username, email } = user;
  const readPercentage = await getQuizCompletionPercentage(
    parseInt(decoded.userId)
  );
  const userData = {
    username,
    email,
    readPercentage: Math.floor(readPercentage),
    premiumEndDate: user.premiumEndDate,
  };
  const isPremium = await updatePremiumStatus(parseInt(decoded.userId));
  return (
    <div className="flex min-h-screen flex-col mt-10">
      <div className="mx-4">
        <ProfileCard userData={userData} isPremium={isPremium} />
      </div>
    </div>
  );
}
