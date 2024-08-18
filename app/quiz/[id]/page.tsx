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

export default async function Days({ params }: { params: { id: string } }) {
  const { id } = params;
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

  const convertedArray = convertQuizDataToArray(quizItemsData);

  const daySteps = convertedArray;
  const dayQuestion = quizData!.question;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base text-skin-base">
      <NewQuiz steps={daySteps} startingLives={lives} question={dayQuestion} />
    </main>
  );
}
