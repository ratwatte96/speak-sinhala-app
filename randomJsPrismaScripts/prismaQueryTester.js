const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    async function getNextQuizId(quizId) {
      // Find the unit that contains this quiz
      const quizInUnit = await prisma.quizesOnUnits.findFirst({
        where: { quizId },
        include: { unit: { include: { quizes: true } } },
      });

      if (!quizInUnit) {
        throw new Error("Quiz not found in any unit.");
      }

      const { unit } = quizInUnit;

      // Extract quiz IDs in their existing order
      const quizIds = unit.quizes.map((q) => q.quizId);

      // Find the current quiz index
      const currentIndex = quizIds.indexOf(quizId);

      // If there is a next quiz in the same unit, return it
      if (currentIndex !== -1 && currentIndex < quizIds.length - 1) {
        return quizIds[currentIndex + 1];
      }

      // If this is the last quiz in the unit, find the next unit
      const nextUnit = await prisma.unit.findFirst({
        where: { id: { gt: unit.id } }, // Get the next unit (assuming units are in order)
        include: { quizes: true },
        orderBy: { id: "asc" }, // Ensure we get the next unit in order
      });

      if (nextUnit && nextUnit.quizes.length > 0) {
        return nextUnit.quizes[0].quizId; // Return the first quiz of the next unit
      }

      return "LastQuiz"; // If there is no next unit, return "LastQuiz"
    }

    // Example usage
    const result = getNextQuizId(118)
      .then((nextQuizId) => console.log("Next Quiz ID:", nextQuizId))
      .catch(console.error)
      .finally(() => prisma.$disconnect());
    // console.log(JSON.stringify(result));
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
