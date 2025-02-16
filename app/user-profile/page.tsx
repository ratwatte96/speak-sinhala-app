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

  let decoded: any;
  let user: any;
  let userData: any = {};
  let isPremium = false;

  try {
    decoded = verifyAccessToken(token.value);
    user = await prisma.user.findUnique({
      where: { id: parseInt(decoded.userId) },
      include: { lives: true },
    });
    userData = await getUserData(user);
    isPremium = await updatePremiumStatus(user.id);
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="flex min-h-screen flex-col ">
      <div className="mx-4  mt-10 flex justify-center">
        {!decoded && (
          <div className="absolute inset-0 flex items-center justify-center dark:border-x dark:border-solid dark:border-gray-600">
            <div className="absolute inset-0 bg-black opacity-10 rounded-lg max-h-[80vh]"></div>
            <div className="flex flex-col">
              <a href="/login" className="relative z-10">
                <button className="bg-green-600 text-white px-2 py-1 rounded-lg font-semibold w-40 mb-2">
                  Login
                </button>
              </a>
              <a href="/signup" className="relative z-10">
                <button className="bg-yellow-400 text-white px-2 py-1 rounded-lg font-semibold w-40">
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
          <ProfileCard userData={userData} isPremium={isPremium} />
        </div>
      </div>
    </div>
  );
}
