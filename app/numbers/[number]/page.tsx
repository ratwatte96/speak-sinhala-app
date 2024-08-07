import NewQuiz from "@/components/NewQuiz";
import { NewQuizData } from "@/components/NewQuizStep";
import { numbers } from "@/lib/quizItem";

export default function Numbers({ params }: { params: { number: string } }) {
  const numberIndex = parseInt(params.number);
  const numbersSteps: NewQuizData[] = numbers[numberIndex];
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base text-skin-base">
      <NewQuiz steps={numbersSteps} />
    </main>
  );
}
