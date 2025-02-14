import ProfileCard from "@/components/ProfileCard";
import Shop from "@/components/ShopComponent";
import { verifyAccessToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { updatePremiumStatus } from "@/utils/checkPremium";
import prisma from "@/lib/prisma";
import Lessons from "@/components/Lessons";
import Tabs from "@/components/Tabs";
import {
  getUserData,
  getUserWithQuizRecords,
  sinhalaCharacters,
} from "@/utils/random";
import { CustomQuizForm } from "@/components/CustomQuizForm";

export default async function Home() {
  const token: any = cookies().get("accessToken"); // Retrieve the token from cookies
  let readStatus: any;
  let decoded: any;
  let userData: any;
  let isPremium = false;
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
    try {
      decoded = verifyAccessToken(token.value);
      const user: any = await prisma.user.findUnique({
        where: { id: parseInt(decoded.userId) },
        include: { lives: true },
      });
      userData = await getUserData(user);
      isPremium = await updatePremiumStatus(parseInt(decoded.userId));
      readStatus = user.readStatus;
      units = await getUserWithQuizRecords(user);
    } catch (error) {
      readStatus = 1;
      console.log(error);
    }
  } else {
    readStatus = 1;
  }

  const sinhalaObjects = sinhalaCharacters.map((char) => ({
    value: char,
    name: char,
  }));

  return (
    <div className="flex max-h-8/10 flex-col mt-10">
      <div className="mx-4 flex flex-col md:flex-row justify-around max-h-[80vh]">
        <div className="relative w-full pl-8 pr-12">
          {!decoded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-10 rounded-lg max-h-[80vh]"></div>
              <div className="flex flex-col">
                <a href="/login" className="relative z-10">
                  <button className="bg-green-600 text-white px-2 py-1 rounded-lg font-semibold w-40 mb-2">
                    Login
                  </button>
                </a>
                <a href="/signup" className="relative z-10">
                  <button className="bg-yellow-300 text-white px-2 py-1 rounded-lg font-semibold w-40">
                    Signup to Unlock
                  </button>
                </a>
              </div>
            </div>
          )}
          <div
            className={`${
              !decoded ? "blur-md pointer-events-none opacity-70" : ""
            }`}
          >
            <Shop />
          </div>
        </div>
        <div className="mx-4 w-full flex justify-center">
          <Tabs
            readComponent={
              <>
                {decoded && (
                  <CustomQuizForm
                    dropDownLetters={sinhalaObjects}
                    isPremium={isPremium}
                  />
                )}
                <Lessons unitData={units} readStatus={readStatus} />
              </>
            }
            speakComponent={
              <div className="text-center">🎤 Speak section coming soon!</div>
            }
          />
        </div>
        <div className="relative w-full flex justify-center pl-12 pr-8">
          {!decoded && (
            <div className="absolute inset-0 flex items-center justify-center max-h-[80vh] ">
              <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
              <div className="flex flex-col">
                <a href="/login" className="relative z-10">
                  <button className="bg-green-600 text-white px-2 py-1 rounded-lg font-semibold w-40 mb-2">
                    Login
                  </button>
                </a>
                <a href="/signup" className="relative z-10">
                  <button className="bg-yellow-300 text-white px-2 py-1 rounded-lg font-semibold w-40">
                    Signup to Unlock
                  </button>
                </a>
              </div>
            </div>
          )}
          <div
            className={`${
              !decoded ? "blur-md pointer-events-none opacity-70" : ""
            }`}
          >
            <ProfileCard
              userData={
                userData ?? {
                  username: "",
                  email: "",
                  readPercentage: 0,
                  premiumEndDate: null,
                }
              }
              isPremium={isPremium}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
