import NewQuiz from "@/components/NewQuiz";
import { numbers } from "@/lib/quizItem";

export default function Numbers() {
  const numbersSteps: QuizData[] = numbers.sort(() => Math.random() - 0.5);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base text-skin-base">
      <NewQuiz steps={numbersSteps} />
    </main>
  );
}
