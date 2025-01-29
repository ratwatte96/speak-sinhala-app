import LessonCard, { Lesson } from "@/components/LessonCard";
import ProfileCard from "@/components/ProfileCard";
import Shop from "@/components/ShopComponent";

export default function UserProfile() {
  const lessons: Lesson[] = [
    {
      number: 1,
      type: "New Letter",
      content: "ka, ga, sa",
      description: "In this lesson you will practice essential letters",
      status: "complete",
    },
    {
      number: 2,
      type: "New Letter",
      content: "ka, ga, sa",
      description: "In this lesson you will practice essential letters",
      status: "incomplete",
    },
    {
      number: 3,
      type: "New Letter",
      content: "ka, ga, sa",
      description: "In this lesson you will practice essential letters",
      status: "locked",
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
        <ProfileCard />
      </div>
    </div>
  );
}
