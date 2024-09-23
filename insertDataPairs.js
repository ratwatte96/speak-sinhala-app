const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const quizQuestion = "Test for 5 pairs questions";
  const data = [
    {
      question_word: `${quizQuestion}1`,
      pairs: [
        ["pa", "ප"],
        ["ta", "ත"],
        ["ma", "ම"],
        ["ba", "බ"],
        ["tha", "ථ"],
      ],
    },

    {
      question_word: `${quizQuestion}2`,
      pairs: [
        ["u", "උ"],
        ["o", "ො"],
        ["i", "ි"],
        ["ba", "බ"],
        ["tha", "ථ"],
      ],
    },
    ,
  ];

  try {
    // Search for quiz or create it
    const existingQuizes = await prisma.quiz.findMany({
      where: {
        quiz_name: {
          equals: quizQuestion,
        },
      },
    });
    let quiz = existingQuizes[0];
    console.log("quiz", quiz);
    if (!quiz) {
      quiz = await prisma.quiz.create({
        data: {
          quiz_name: quizQuestion,
        },
      });
    }

    // Create question and pairs related to question
    data.forEach(async (item) => {
      const existingQuestions = await prisma.question.findMany({
        where: {
          question_word: {
            equals: item.question_word,
          },
        },
        include: {
          quizes: true,
        },
      });

      let newQuestion = existingQuestions[0];
      console.log(newQuestion);
      if (!newQuestion) {
        newQuestion = await prisma.question.create({
          data: {
            question_word: item.question_word,
            questionType: 4,
          },
          include: {
            quizes: true,
          },
        });
      }

      if (newQuestion.quizes.length === 0) {
        const connectQuiz = await prisma.question.update({
          where: {
            id: newQuestion.id,
          },
          data: {
            quizes: {
              create: {
                quiz: {
                  connect: { id: quiz.id },
                },
              },
            },
          },
        });
      }

      item.pairs.forEach(async (element, i) => {
        const existingPairs = await prisma.pair.findMany({
          where: {
            sinhala: {
              equals: element[1],
            },
            sound: {
              equals: element[0],
            },
          },
          include: {
            questions: true,
          },
        });
        let pair = existingPairs[0];

        if (!pair) {
          pair = await prisma.pair.create({
            data: {
              sinhala: element[1],
              sound: element[0],
            },
            include: {
              questions: true,
            },
          });
        }

        if (
          !pair.questions.some(
            (question) => question.questionId === newQuestion.id
          )
        ) {
          console.log("pair", pair, new Date().toString());
          console.log("newQuestion", newQuestion, new Date().toString());
          const connectQuestion = await prisma.pair.update({
            where: {
              id: pair.id,
            },
            data: {
              questions: {
                create: {
                  question: {
                    connect: { id: newQuestion.id },
                  },
                },
              },
            },
          });
        }
      });
    });
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
