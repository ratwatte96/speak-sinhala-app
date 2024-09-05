import NewQuiz from "@/components/NewQuiz";
import { NewQuizData } from "@/components/NewQuizStep";
import { vowels } from "@/lib/quizItem";

export default function Vowels() {
  const vowelSteps: any[] = vowels;

  let lives = 100;
  try {
    fetch(`${process.env.API_URL}api/lives`)
      .then((res) => res.json())
      .then((livesData) => {
        lives = livesData.total_lives;
      });
  } catch (error: any) {
    console.log(error);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base">
      <NewQuiz steps={vowelSteps} startingLives={lives} />
    </main>
  );
}
