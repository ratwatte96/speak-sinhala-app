import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { NewLetterData } from "@/components/Step";

function convertNewLetterData(data: any): NewLetterData[] {
  return data.map((item: any) => ({
    sound: item.newLetterData.sound,
    sinhala: item.newLetterData.sinhala,
    englishWord: item.newLetterData.englishWord,
  }));
}

function getAnswers(pairsData: any, selectedPair: any, isSinhala: any) {
  let answers = isSinhala
    ? pairsData
        .sort((a: any, b: any) => 0.5 - Math.random())
        .map((pair: any) => ({
          id: pair.id,
          buttonLabel: pair.sinhala,
          value: pair.sinhala,
          audio: pair.sound,
        }))
        .slice(0, 4)
    : pairsData
        .sort((a: any, b: any) => 0.5 - Math.random())
        .map((pair: any) => ({
          id: pair.id,
          buttonLabel: pair.english,
          value: pair.english,
          audio: pair.sound,
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
            buttonLabel: selectedPair.english,
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

  order.pairOrder.map(({ isHard, isNew, newLetter, questionType }: any) => {
    let newQuestion: any;
    const selectedPair = pairData.find((pair: any) => {
      return pair.sound == pairs[newLetter - 1];
    });
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
              ? selectedPair.english
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
      const randomisedPairs = pairData
        .sort((a: any, b: any) => 0.5 - Math.random())
        .slice(0, 4);
      newQuestion = {
        questionId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, //Unique id
        type: "question",
        content: {
          questionType: questionType,
          pairs: randomisedPairs,
          sounds: randomisedPairs.sort((a: any, b: any) => 0.5 - Math.random()),
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
              ? selectedPair.english
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

export async function POST(req: any) {
  const cookies = req.headers.get("cookie");
  if (!cookies) {
    return NextResponse.json({ error: "No cookies found" }, { status: 400 });
  }

  // Parse cookies (basic approach)
  const cookieArray = cookies
    .split("; ")
    .map((cookie: any) => cookie.split("="));
  const cookieMap = Object.fromEntries(cookieArray);

  const accessToken = cookieMap["accessToken"];

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token missing" },
      { status: 401 }
    );
  }

  const { selectedItems } = await req.json();

  const existingPairs = await prisma.pair.findMany({
    where: {
      sinhala: {
        in: selectedItems,
      },
    },
  });

  const englishLetters = existingPairs.map((pair: any) => pair.english);
  const order = {
    pairs: englishLetters,
    pairOrder: [
      { isHard: false, newLetter: 1, questionType: 2 },
      { isHard: false, newLetter: 1, questionType: 1 },
      { isHard: false, newLetter: 2, questionType: 2 },
      { isHard: false, newLetter: 2, questionType: 1 },
      { isHard: false, newLetter: 1, questionType: 3 },
      { isHard: false, newLetter: 3, questionType: 2 },
      { isHard: false, newLetter: 3, questionType: 1 },
      { isHard: false, newLetter: 2, questionType: 3 },
      { isHard: false, newLetter: 3, questionType: 3 },
      { isHard: false, newLetter: 0, questionType: 4 },
      { isHard: true, newLetter: 2, questionType: 2 },
      { isHard: true, newLetter: 3, questionType: 2 },
      { isHard: true, newLetter: 1, questionType: 2 },
      { isHard: true, newLetter: 1, questionType: 3 },
      { isHard: true, newLetter: 3, questionType: 3 },
      { isHard: true, newLetter: 2, questionType: 3 },
      { isHard: true, newLetter: 0, questionType: 4 },
    ],
    isLetterQuiz: true,
  };
  const quizSteps = createSteps(order, existingPairs);

  return new Response(JSON.stringify(quizSteps), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
