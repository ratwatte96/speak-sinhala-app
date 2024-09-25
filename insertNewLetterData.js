const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const quizQuestion = "Lesson 1";
  const data = [
    { sound: "ga", sinhala: "ග​", englishWord: "gun" },
    { sound: "ma", sinhala: "ම", englishWord: "march" },
    { sound: "sa", sinhala: "ස", englishWord: "sunday" },
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

    // Create New Letter Data
    data.forEach(async ({ sinhala, sound, englishWord }) => {
      const existingNewLetterData = await prisma.newLetterData.findMany({
        where: {
          sinhala: {
            equals: sinhala,
          },
        },
        include: {
          quizes: true,
        },
      });

      let newLetterData = existingNewLetterData[0];
      console.log(newLetterData);
      if (!newLetterData) {
        newLetterData = await prisma.newLetterData.create({
          data: {
            sinhala: sinhala,
            sound: sound,
            englishWord: englishWord,
          },
          include: {
            quizes: true,
          },
        });
      }

      if (newLetterData.quizes.length === 0) {
        const connectQuiz = await prisma.newLetterData.update({
          where: {
            id: newLetterData.id,
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
    });
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
