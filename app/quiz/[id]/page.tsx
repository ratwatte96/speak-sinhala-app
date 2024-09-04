import NewQuiz from "@/components/NewQuiz";
import prisma from "@/lib/prisma";

type Answer = {
  buttonLabel: string;
  value: string;
};

type ConvertedQuestion = {
  phonetic: string;
  correctAnswer: string;
  questionType: number;
  answers: Answer[];
};

function convertQuizDataToArray(data: any): ConvertedQuestion[] {
  return data.flatMap((item: any) =>
    item.questions.map((q: any) => ({
      phonetic: q.question.phonetic,
      correctAnswer: q.question.correctAnswer,
      questionType: q.question.questionType,
      answers: q.question.answers.map((a: any) => ({
        buttonLabel: a.answer.buttonLabel,
        value: a.answer.value,
      })),
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

export default async function Days({ params }: { params: { id: string } }) {
  const { id } = params;
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

  const daySteps = convertQuizDataToArray(quizItemsData).sort(
    () => Math.random() - 0.5
  );
  const dayQuestion = quizData!.quiz_name ?? "";

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base text-skin-base">
      <NewQuiz steps={daySteps} startingLives={lives} question={dayQuestion} />
    </main>
  );
}
