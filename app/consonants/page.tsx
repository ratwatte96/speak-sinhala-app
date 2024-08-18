import NewQuiz from "@/components/NewQuiz";
import { NewQuizData } from "@/components/NewQuizStep";
import { consonants } from "@/lib/quizItem";

export default function Consonants() {
  const consonantSteps: NewQuizData[] = consonants.sort(
    () => Math.random() - 0.5
  );
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
      <NewQuiz steps={consonantSteps} startingLives={lives} />
    </main>
  );
}
