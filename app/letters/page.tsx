import Quiz from "@/components/Quiz";
import { QuizData } from "@/components/QuizStep";

export default function Letters() {
  const quizSteps: QuizData[] = [
    {
      question: "Choose the correct letter",
      answers: [
        { buttonLabel: "A", value: "A" },
        { buttonLabel: "B", value: "B" },
        { buttonLabel: "C", value: "C" },
        { buttonLabel: "D", value: "D" },
      ],
      imagePath: "/testImage.webp",
      audioPath: "/test.mp3",
      correctAnswer: "A",
    },
    {
      question: "What is the capital of Germany?",
      answers: [
        { buttonLabel: "Berlin", value: "berlin" },
        { buttonLabel: "Madrid", value: "madrid" },
        { buttonLabel: "Rome", value: "rome" },
      ],
      imagePath: "/testImage.webp",
      audioPath: "/test2.mp3",
      correctAnswer: "rome",
    },
    {
      question: "Choose the correct letter",
      answers: [
        { buttonLabel: "A", value: "A" },
        { buttonLabel: "B", value: "B" },
        { buttonLabel: "C", value: "C" },
        { buttonLabel: "D", value: "D" },
      ],
      imagePath: "/testImage.webp",
      audioPath: "/test.mp3",
      correctAnswer: "A",
    },
    {
      question: "What is the capital of Germany?",
      answers: [
        { buttonLabel: "Berlin", value: "berlin" },
        { buttonLabel: "Madrid", value: "madrid" },
        { buttonLabel: "Rome", value: "rome" },
      ],
      imagePath: "/testImage.webp",
      audioPath: "/test2.mp3",
      correctAnswer: "rome",
    },
    {
      question: "Choose the correct letter",
      answers: [
        { buttonLabel: "A", value: "A" },
        { buttonLabel: "B", value: "B" },
        { buttonLabel: "C", value: "C" },
        { buttonLabel: "D", value: "D" },
      ],
      imagePath: "/testImage.webp",
      audioPath: "/test.mp3",
      correctAnswer: "A",
    },
    {
      question: "What is the capital of Germany?",
      answers: [
        { buttonLabel: "Berlin", value: "berlin" },
        { buttonLabel: "Madrid", value: "madrid" },
        { buttonLabel: "Rome", value: "rome" },
      ],
      imagePath: "/testImage.webp",
      audioPath: "/test2.mp3",
      correctAnswer: "rome",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base">
      <Quiz steps={quizSteps} />
    </main>
  );
}
