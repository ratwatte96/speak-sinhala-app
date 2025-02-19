import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId, quizProgress } = await req.json();

  try {
    const units = await prisma.unit.findMany({
      where: { id: { in: [1, 2] } },
      include: { quizes: { select: { quizId: true } } },
    });

    for (const unit of units) {
      for (const quiz of unit.quizes) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            quizes: {
              create: {
                quiz: { connect: { id: quiz.quizId } },
                status:
                  quizProgress?.quizes?.find(
                    (q: any) => q.quizId === quiz.quizId
                  )?.status || "incomplete",
                perfect_score:
                  quizProgress?.quizes?.find(
                    (q: any) => q.quizId === quiz.quizId
                  )?.isPerfect || false,
              },
            },
          },
        });
      }
    }

    return new Response(JSON.stringify({ message: "Quizzes assigned" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Quiz data creation failed" }),
      {
        status: 500,
      }
    );
  }
}
