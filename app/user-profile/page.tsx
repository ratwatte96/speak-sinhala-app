import ProfileCard from "@/components/ProfileCard";
import prisma from "@/lib/prisma";
import { verifyAccessToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserProfile() {
  const token: any = cookies().get("accessToken"); // Retrieve the token from cookies

  if (!token) {
    redirect("/login"); // Redirect to login if no token is present
    return null;
  }

  let decoded: any;
  try {
    decoded = verifyAccessToken(token.value);
  } catch (error) {
    redirect("/login"); // Redirect to login if token verification fails
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
  const userData = { username, email };

  return (
    <div className="flex min-h-screen flex-col mt-10">
      <div className="mx-4">
        <ProfileCard userData={userData} />
      </div>
    </div>
  );
}
