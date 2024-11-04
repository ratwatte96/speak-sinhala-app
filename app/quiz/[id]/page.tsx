import Quiz from "@/components/Quiz";
import { NewLetterData, Step } from "@/components/Step";
import prisma from "@/lib/prisma";

function convertNewLetterData(data: any): NewLetterData[] {
  return data.map((item: any) => ({
    sound: item.newLetterData.sound,
    sinhala: item.newLetterData.sinhala,
    englishWord: item.newLetterData.englishWord,
  }));
}

function createSteps(order: any, pairData: any): any {
  let steps: any = [];
  const pairs = order.pairs;
  const mappedPairData = pairData.pairs.map((pair: any) => ({
    id: pair.pair.id,
    sinhala: pair.pair.sinhala,
    sound: pair.pair.sound,
    english: pair.pair.english,
  }));
  const englishAnswers = pairData.pairs.map((pair: any) => ({
    id: pair.pair.id,
    buttonLabel: pair.pair.english,
    value: pair.pair.english,
    audio: pair.pair.sound,
  }));
  const sinhalaAnswers = pairData.pairs.map((pair: any) => ({
    id: pair.pair.id,
    buttonLabel: pair.pair.sinhala,
    value: pair.pair.sinhala,
    audio: pair.pair.sound,
  }));

  order.pairOrder.map(({ isHard, newLetter, questionType }: any) => {
    let newQuestion: any;
    const selectedPair = mappedPairData.find(
      (pair: any) => pair.english == pairs[newLetter - 1]
    );

    if (questionType === 4) {
      newQuestion = {
        questionId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, //Unique id
        type: "question",
        content: {
          questionType: questionType,
          pairs: mappedPairData,
          sounds: mappedPairData
            .map((pair: any) => pair.sound)
            .sort((a: any, b: any) => 0.5 - Math.random()),
          isHard: isHard,
        },
      };
    } else {
      newQuestion = {
        questionId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "question",
        content: {
          question_word:
            questionType === 3 || questionType === 2
              ? selectedPair.english
              : selectedPair.sinhala,
          additonal_information: selectedPair?.additonal_information,
          correctAnswer:
            questionType === 3 || questionType === 2
              ? selectedPair.sinhala
              : selectedPair.english,
          questionType: questionType,
          answers:
            questionType === 3 || questionType === 2
              ? sinhalaAnswers
              : englishAnswers,
          audio: selectedPair.sound,
          specific_note: selectedPair.specific_note,
          isHard: isHard,
        },
      };
    }
    //! if isHard isn't working look here
    // let clone = structuredClone(orderedElement);
    // clone.content.isHard = isHard;
    steps.push(newQuestion);
  });
  return steps;
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
      pairs: {
        include: {
          pair: true,
        },
      },
      newLetterDatas: {
        include: {
          newLetterData: true,
        },
      },
    },
  });

  const quizSteps = createSteps(quizData?.order, quizItemsData[0]);

  if (quizItemsData[0].newLetterDatas) {
    const newLetterStepData = convertNewLetterData(
      quizItemsData[0].newLetterDatas
    );
    quizSteps.unshift({
      type: "newLetterData",
      content: newLetterStepData,
    });
  }

  if (quizData?.lessonContent) {
    quizSteps.unshift({ type: "lesson", content: { stepType: "lesson" } });
  }

  const quizQuestion = quizData!.quiz_name ?? "";

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base text-skin-base">
      <Quiz steps={quizSteps} startingLives={lives} quiz_title={quizQuestion} />
    </main>
  );
}
