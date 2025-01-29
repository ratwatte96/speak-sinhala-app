import LessonCard, { Lesson } from "@/components/LessonCard";
import BottomNavbar from "@/components/BottomNavbar";
import TopNavbar from "@/components/TopNavBar";

export default function Read() {
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
    <div className="flex min-h-screen flex-col mt-10 pb-24">
      <div className="mx-4">
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
        {lessons.map((lesson) => (
          <LessonCard key={lesson.number} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
