import Quiz from "@/components/Quiz";
import { Step } from "@/components/Step";
import prisma from "@/lib/prisma";

function convertQuizDataToQuestionType(data: any): Step[] {
  return data.flatMap((item: any) =>
    item.questions.map((q: any) => ({
      type: "question",
      content: {
        question_word: q.question.question_word,
        additional_infomation: q.question.additonal_information,
        correctAnswer: q.question.correctAnswer,
        questionType: q.question.questionType,
        answers: q.question.answers.map((a: any) => ({
          buttonLabel: a.answer.buttonLabel,
          value: a.answer.value,
          audio: a.answer.audio,
        })),
        audio: q.question.audio,
      },
    }))
  );
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default async function QuizPage({ params }: { params: { id: string } }) {
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

  const { id } = params;
  const quizData = await prisma.quiz.findFirst({
    where: {
      id: parseInt(id),
    },
  });

  const quizItemsData = await prisma.quiz.findMany({
    where: {
      id: parseInt(id),
    },
    include: {
      questions: {
        include: {
          question: {
            include: {
              answers: {
                include: {
                  answer: true,
                },
              },
            },
          },
        },
      },
    },
  });

  quizItemsData.forEach((quizItem) => {
    quizItem.questions.forEach((question) => {
      question.question.answers = shuffleArray(question.question.answers);
    });
  });
  const daySteps = convertQuizDataToQuestionType(quizItemsData).sort(
    () => Math.random() - 0.5
  );
  if (quizData?.lessonContent) {
    daySteps.unshift({ type: "lesson", content: { stepType: "lesson" } });
  }
  const dayQuestion = quizData!.quiz_name ?? "";

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base text-skin-base">
      <Quiz steps={daySteps} startingLives={lives} quiz_title={dayQuestion} />
    </main>
  );
}
