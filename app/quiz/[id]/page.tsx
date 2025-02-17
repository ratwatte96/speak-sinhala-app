import Quiz from "@/components/Quiz";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { verifyAccessToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { updatePremiumStatus } from "@/utils/checkPremium";
import { ThemeProvider } from "@/components/ThemeProvider";
import { errorWithFile } from "@/utils/logger";

function getAnswers(pairsData: any, selectedPair: any, isSinhala: any) {
  let answers = isSinhala
    ? pairsData.pairs
        .sort((a: any, b: any) => 0.5 - Math.random())
        .map((pair: any) => ({
          id: pair.pair.id,
          buttonLabel: pair.pair.sinhala,
          value: pair.pair.sinhala,
          audio: pair.pair.sound,
        }))
        .slice(0, 4)
    : pairsData.pairs
        .sort((a: any, b: any) => 0.5 - Math.random())
        .map((pair: any) => ({
          id: pair.pair.id,
          buttonLabel: pair.pair.sound,
          value: pair.pair.english,
          audio: pair.pair.sound,
        }))
        .slice(0, 4);

  if (!answers.find((answer: any) => answer.audio === selectedPair.sound)) {
    answers = isSinhala
      ? [
          ...answers.slice(1),
          {
            id: selectedPair.id,
            buttonLabel: selectedPair.sinhala,
            value: selectedPair.sinhala,
            audio: selectedPair.sound,
          },
        ]
      : [
          ...answers.slice(1),
          {
            id: selectedPair.id,
            buttonLabel: selectedPair.sound,
            value: selectedPair.english,
            audio: selectedPair.sound,
          },
        ];
  }

  return answers;
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

  order.pairOrder.map(({ isHard, isNew, newLetter, questionType }: any) => {
    let newQuestion: any;
    const selectedPair = mappedPairData.find(
      (pair: any) => pair.sound == pairs[newLetter - 1]
    );

    if (questionType === 5) {
      const answers =
        questionType === 3 || questionType === 2
          ? getAnswers(pairData, selectedPair, true)
          : getAnswers(pairData, selectedPair, false);

      newQuestion = {
        questionId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "question",
        content: {
          question_word:
            questionType === 3 || questionType === 2
              ? selectedPair.sound
              : selectedPair.sinhala,
          additonal_information: selectedPair?.additonal_information,
          correctAnswer:
            questionType === 3 || questionType === 2
              ? selectedPair.sinhala
              : selectedPair.english,
          questionType: questionType,
          answers: answers,
          audio: selectedPair.sound,
          specific_note: selectedPair.specific_note,
          isHard: isHard,
          isNew: isNew,
          isMistake: false,
          isLetterQuiz: order.isLetterQuiz,
        },
      };
    } else if (questionType === 4 || questionType === 6) {
      const randomisedPairs = mappedPairData
        .sort((a: any, b: any) => 0.5 - Math.random())
        .slice(0, 4);
      let randomisedClone = structuredClone(randomisedPairs);
      newQuestion = {
        questionId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, //Unique id
        type: "question",
        content: {
          questionType: questionType,
          pairs: randomisedPairs,
          sounds: randomisedClone.sort((a: any, b: any) => 0.5 - Math.random()),
          isHard: isHard,
          isNew: isNew,
          isMistake: false,
          isLetterQuiz: order.isLetterQuiz,
        },
      };
    } else {
      const answers =
        questionType === 3 || questionType === 2
          ? getAnswers(pairData, selectedPair, true)
          : getAnswers(pairData, selectedPair, false);

      newQuestion = {
        questionId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "question",
        content: {
          question_word:
            questionType === 3 || questionType === 2
              ? selectedPair.sound
              : selectedPair.sinhala,
          additonal_information: selectedPair?.additonal_information,
          correctAnswer:
            questionType === 3 || questionType === 2
              ? selectedPair.sinhala
              : selectedPair.english,
          questionType: questionType,
          answers: answers,
          audio: selectedPair.sound,
          specific_note: selectedPair.specific_note,
          isHard: isHard,
          isNew: isNew,
          isMistake: false,
          isLetterQuiz: order.isLetterQuiz,
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
  const callbackUrl = "/read";
  const { id } = params;
  const token: any = cookies().get("accessToken");
  let validToken: any;
  try {
    validToken = verifyAccessToken(token.value);
  } catch (error) {
    errorWithFile(error);
  }
  let user: any;
  let readStatus: any;
  let isPremium: any;

  if (
    (validToken && ["28", "29", "30", "31", "32", "33"].includes(id)) ||
    !["28", "29", "30", "31", "32", "33"].includes(id)
  ) {
    try {
      user = await prisma.user.findUnique({
        where: {
          id: parseInt(validToken.userId),
        },
      });
      isPremium = await updatePremiumStatus(parseInt(validToken.userId));
      readStatus = user.readStatus;
    } catch (error) {
      errorWithFile(error);
      redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  }

  const unit: any = await prisma.quizesOnUnits.findFirst({
    where: {
      quizId: parseInt(id), // Find the row where the given quiz exists
    },
    include: {
      unit: true, // Include the unit details
    },
  });

  if (readStatus < unit?.unit.id) {
    redirect(`/no-access`);
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
      pairs: {
        include: {
          pair: true,
        },
      },
    },
  });

  const quizSteps = createSteps(quizData?.order, quizItemsData[0]);

  if (quizData?.lessonContent) {
    //!add data from lesson content column
    quizSteps.unshift({
      type: "lesson",
      content: { stepType: "lesson", data: quizData.lessonContent },
    });
  }

  const quizQuestion = quizData!.quiz_name ?? "";

  return (
    <ThemeProvider>
      <div className="flex min-h-[90vh] flex-col items-center justify-center bg-[#EAEAEA] dark:bg-black animate-fadeIn">
        <Quiz
          steps={quizSteps}
          quiz_title={quizQuestion}
          quiz_id={parseInt(id)}
          loggedOut={!validToken}
          isPremium={isPremium}
        />
      </div>
    </ThemeProvider>
  );
}
