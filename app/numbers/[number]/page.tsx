import NewQuiz from "@/components/NewQuiz";
import { NewQuizData } from "@/components/NewQuizStep";
import { numbers } from "@/lib/quizItem";

export default function Numbers({ params }: { params: { number: string } }) {
  const startingNumber = parseInt(params.number);
  const numbersSteps: NewQuizData[] = numbers
    .slice(startingNumber, startingNumber + 11)
    .sort(() => Math.random() - 0.5);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base text-skin-base">
      <NewQuiz steps={numbersSteps} />
    </main>
  );
}
