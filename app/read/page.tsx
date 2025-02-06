import Lessons from "@/components/Lessons";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/utils/auth";
import { getUserWithQuizRecords } from "@/utils/random";
import { cookies } from "next/headers";

export default async function Read() {
  let units: any = await prisma.unit.findMany({
    select: {
      quizes: {
        include: {
          quiz: true,
        },
      },
    },
  });

  const token: any = cookies().get("accessToken"); // Retrieve the token from cookies
  let user: any;
  let readStatus: any;
  let decoded: any;
  if (token) {
    try {
      decoded = verifyAccessToken(token.value);
      user = await prisma.user.findUnique({
        where: {
          id: parseInt(decoded.userId),
        },
      });
      readStatus = user.readStatus;
      units = await getUserWithQuizRecords(user);
    } catch (error) {
      //! add
    }
  } else {
    readStatus = 1;
  }

  return (
    <div className="flex min-h-screen flex-col mt-10 pb-24">
      <div className="mx-4">
        <h1>READ</h1>
        <div
          className="bg-green-500 h-2.5 rounded-full"
          style={{ width: `${80}%` }}
        ></div>
        <Lessons unitData={units} readStatus={readStatus} />
      </div>
    </div>
  );
}
