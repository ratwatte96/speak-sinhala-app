import Quiz from "@/components/Quiz";
import { NewLetterData, Step } from "@/components/Step";
import prisma from "@/lib/prisma";

function convertQuizDataToQuestionType(data: any): Step[] {
  return data.flatMap((item: any) =>
    item.questions.map((q: any) => {
      if (q.question.questionType === 4) {
        const pairs = q.question.pairs.map((pair: any) => ({
          id: pair.pair.id,
          sinhala: pair.pair.sinhala,
          sound: pair.pair.sound,
        }));

        return {
          questionId: q.questionId,
          type: "question",
          content: {
            questionType: q.question.questionType,
            pairs: pairs,
            sounds: pairs
              .map((pair: any) => pair.sound)
              .sort((a: any, b: any) => 0.5 - Math.random()),
            isHard: false,
          },
        };
      } else {
        return {
          questionId: q.questionId,
          type: "question",
          content: {
            question_word: q.question.question_word,
            additonal_information: q.question.additonal_information,
            correctAnswer: q.question.correctAnswer,
            questionType: q.question.questionType,
            answers: q.question.answers.map((a: any) => ({
              id: a.answer.id,
              buttonLabel: a.answer.buttonLabel,
              value: a.answer.value,
              audio: a.answer.audio,
            })),
            audio: q.question.audio,
            specific_note: q.question.specific_note,
            isHard: false,
          },
        };
      }
    })
  );
}

function convertNewLetterData(data: any): NewLetterData[] {
  return data.map((item: any) => ({
    sound: item.newLetterData.sound,
    sinhala: item.newLetterData.sinhala,
    englishWord: item.newLetterData.englishWord,
  }));
}

function orderSteps(order: any, data: any): any {
  let orderedSteps: any = [];
  order.map(({ questionId, isHard }: any) => {
    const orderedElement = data.find(
      (element: any) => element.questionId === questionId
    );
    let clone = structuredClone(orderedElement);
    clone.content.isHard = isHard;
    orderedSteps.push(clone);
  });
  return orderedSteps;
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
              pairs: { include: { pair: true } },
            },
          },
        },
      },
      newLetterDatas: {
        include: {
          newLetterData: true,
        },
      },
    },
  });

  quizItemsData.forEach((quizItem) => {
    quizItem.questions.forEach((question) => {
      if (question.question.questionType !== 4) {
        question.question.answers = shuffleArray(question.question.answers);
      }
    });
  });

  const questionSteps = convertQuizDataToQuestionType(quizItemsData);

  const orderedSteps = orderSteps(quizData?.order, questionSteps);

  if (quizItemsData[0].newLetterDatas) {
    const newLetterStepData = convertNewLetterData(
      quizItemsData[0].newLetterDatas
    );
    orderedSteps.unshift({
      type: "newLetterData",
      content: newLetterStepData,
    });
  }

  if (quizData?.lessonContent) {
    orderedSteps.unshift({ type: "lesson", content: { stepType: "lesson" } });
  }

  const quizQuestion = quizData!.quiz_name ?? "";

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base text-skin-base">
      <Quiz
        steps={orderedSteps}
        startingLives={lives}
        quiz_title={quizQuestion}
      />
    </main>
  );
}
