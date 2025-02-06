import LessonCard, { Lesson } from "@/components/LessonCard";
import ProfileCard from "@/components/ProfileCard";
import Shop from "@/components/ShopComponent";
import { verifyAccessToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  const callbackUrl = "/home";
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

  const lessons: Lesson[] = [
    {
      type: "New Letter",
      content: "ka, ga, sa",
      description: "In this lesson you will practice essential letters",
      status: "complete",
      quizName: "",
      number: undefined,
    },
    {
      type: "New Letter",
      content: "ka, ga, sa",
      description: "In this lesson you will practice essential letters",
      status: "incomplete",
      quizName: "",
      number: undefined,
    },
    {
      type: "New Letter",
      content: "ka, ga, sa",
      description: "In this lesson you will practice essential letters",
      status: "locked",
      quizName: "",
      number: undefined,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col mt-10">
      <div className="mx-4 flex flex-col md:flex-row justify-around">
        <Shop />
        <div>
          <h1>READ</h1>
          <div
            className="bg-green-500 h-2.5 rounded-full"
            style={{ width: `${80}%` }}
          ></div>
          {lessons.map((lesson) => (
            <LessonCard key={lesson.number} lesson={lesson} />
          ))}
          {lessons.map((lesson) => (
            <LessonCard key={lesson.number} lesson={lesson} />
          ))}
        </div>
        <ProfileCard
          userData={{ username: "testtest", email: "testtest@testtest.com" }}
          isPremium={false}
        />
      </div>
    </div>
  );
}
