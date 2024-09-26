const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const quizQuestion = "Lesson 1";
  const orderData = [
    { questionId: 403, isHard: false },
    { questionId: 381, isHard: false },
    { questionId: 369, isHard: false },
    { questionId: 340, isHard: false },
    { questionId: 505, isHard: false },
    { questionId: 411, isHard: false },
    { questionId: 420, isHard: false },
    { questionId: 506, isHard: false },
    { questionId: 507, isHard: false },
    { questionId: 508, isHard: false },
    { questionId: 340, isHard: true },
    { questionId: 420, isHard: true },
    { questionId: 381, isHard: true },
    { questionId: 505, isHard: true },
    { questionId: 507, isHard: true },
    { questionId: 506, isHard: true },
    { questionId: 508, isHard: true },
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

    // Insert order Json
    const addOrder = await prisma.quiz.update({
      where: {
        id: quiz.id,
      },
      data: {
        order: JSON.stringify(orderData),
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
