import ProfileCard from "@/components/ProfileCard";
import Shop from "@/components/ShopComponent";
import { verifyAccessToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { getUserData } from "../user-profile/page";
import { updatePremiumStatus } from "@/utils/checkPremium";
import prisma from "@/lib/prisma";
import { getUserWithQuizRecords } from "../read/page";
import Lessons from "@/components/Lessons";
import Tabs from "@/components/Tabs";

export default async function Home() {
  const token: any = cookies().get("accessToken"); // Retrieve the token from cookies
  let readStatus: any;
  let decoded: any;
  let userData: any;
  let isPremium: any;
  let units: any = await prisma.unit.findMany({
    select: {
      quizes: {
        include: {
          quiz: true,
        },
      },
    },
  });

  if (token) {
    decoded = verifyAccessToken(token.value);
    const user: any = await prisma.user.findUnique({
      where: { id: parseInt(decoded.userId) },
      include: { lives: true },
    });
    userData = await getUserData(user);
    isPremium = await updatePremiumStatus(parseInt(decoded.userId));
    readStatus = user.readStatus;
    units = await getUserWithQuizRecords(user);
  } else {
    readStatus = 1;
  }

  return (
    <div className="flex min-h-screen flex-col mt-10">
      <div className="mx-4 flex flex-col md:flex-row justify-around">
        {token && <Shop />}
        <div className="mx-4 w-full">
          <Tabs
            readComponent={<Lessons unitData={units} readStatus={readStatus} />}
            speakComponent={
              <div className="text-center">🎤 Speak section coming soon!</div>
            }
          />
        </div>
        {token && <ProfileCard userData={userData} isPremium={isPremium} />}
      </div>
    </div>
  );
}
