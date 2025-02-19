import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId, quizProgress } = await req.json();

  try {
    // Fetch all quizzes belonging to Unit 1 and Unit 2
    const quizzes = await prisma.quizesOnUnits.findMany({
      where: { unitId: { in: [1, 2] } },
      select: { quizId: true },
    });

    const parsedQuizProgress = JSON.parse(quizProgress);
    // Transform data for batch insert
    const quizData = quizzes.map(({ quizId }) => ({
      userId,
      quizId,
      status:
        parsedQuizProgress?.quizes?.find((q: any) => q.quizId === quizId)
          ?.status || "incomplete",
      perfect_score:
        parsedQuizProgress?.quizes?.find((q: any) => q.quizId === quizId)
          ?.isPerfect || false,
    }));

    // Perform bulk insert
    await prisma.usersOnQuizes.createMany({
      data: quizData,
      skipDuplicates: true, // Avoid duplicate errors
    });

    return new Response(
      JSON.stringify({ message: "Quizzes successfully assigned!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning quizzes:", error);
    return new Response(
      JSON.stringify({ error: "Quiz data creation failed" }),
      { status: 500 }
    );
  }
}
