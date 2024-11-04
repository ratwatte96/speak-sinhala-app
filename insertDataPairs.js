const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const quizQuestion = "New Rule: Word pronunciation";
  const data = [
    ["gasuh", "ගස"],
    ["mamuh", "මම"],
    ["masuh", "මස"],
    ["gamuh", "ගම"],
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

    if (!quiz) {
      quiz = await prisma.quiz.create({
        data: {
          quiz_name: quizQuestion,
        },
      });
    }

    //Find or create Pairs and connect quiz
    data.forEach(async (element, i) => {
      const existingPairs = await prisma.pair.findMany({
        where: {
          sinhala: {
            equals: element[1],
          },
          sound: {
            equals: element[0],
          },
        },
      });
      let pair = existingPairs[0];

      if (!pair) {
        pair = await prisma.pair.create({
          data: {
            sinhala: element[1],
            sound: element[0],
            english: element[0],
          },
          include: {
            quizes: true,
          },
        });
      }

      const connectQuiz = await prisma.pair.update({
        where: {
          id: pair.id,
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
    });
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
