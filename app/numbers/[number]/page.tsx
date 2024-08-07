import NewQuiz from "@/components/NewQuiz";
import { NewQuizData } from "@/components/NewQuizStep";
import { numbers } from "@/lib/quizItem";

export default function Numbers({ params }: { params: { number: string } }) {
  const numberIndex = parseInt(params.number);
  const numbersSteps: NewQuizData[] = numbers[numberIndex].sort(
    () => Math.random() - 0.5
  );
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base text-skin-base">
      <NewQuiz steps={numbersSteps} startingLives={lives} />
    </main>
  );
}
