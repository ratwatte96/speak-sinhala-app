import NewQuiz from "@/components/NewQuiz";
import { NewQuizData } from "@/components/NewQuizStep";
import { vowels } from "@/lib/quizItem";

export default function Vowels() {
  const vowelSteps: NewQuizData[] = vowels.sort(() => Math.random() - 0.5);

  let lives = 100;
  try {
    fetch(`/api/lives`)
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
