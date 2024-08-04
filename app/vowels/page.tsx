import Quiz from "@/components/Quiz";
import { QuizData } from "@/components/QuizStep";
import { vowels } from "@/lib/quizItem";

export default function Vowels() {
  const vowelSteps: QuizData[] = vowels.sort(() => Math.random() - 0.5);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base">
      <Quiz steps={vowelSteps} />
    </main>
  );
}
