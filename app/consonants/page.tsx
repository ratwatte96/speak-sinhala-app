import Quiz from "@/components/Quiz";
import { QuizData } from "@/components/QuizStep";
import { consonants } from "@/lib/quizItem";

export default function Consonants() {
  const consonantSteps: QuizData[] = consonants.sort(() => Math.random() - 0.5);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base">
      <Quiz steps={consonantSteps} />
    </main>
  );
}
