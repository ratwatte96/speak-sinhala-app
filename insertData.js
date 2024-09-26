const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const quizQuestion = "Lesson 1";
  const data = [
    { question_word: "ma", correctAnswer: "ම", type: "3" },
    { question_word: "sa", correctAnswer: "ස", type: "3" },
    { question_word: "ga", correctAnswer: "ග", type: "3" },
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

    // Create each answer, related question and link it to the quiz
    data.forEach(async ({ question_word, correctAnswer, type }) => {
      const existingQuestions = await prisma.question.findMany({
        where: {
          correctAnswer: {
            equals: correctAnswer,
          },
          questionType: {
            equals: parseInt(type),
          },
        },
        include: {
          quizes: true,
        },
      });
      let question = existingQuestions[0];

      if (!question) {
        question = await prisma.question.create({
          data: {
            question_word: question_word,
            correctAnswer: correctAnswer,
            questionType: parseInt(type),
          },
          include: {
            quizes: true,
          },
        });
      }

      if (!question.quizes.some((element) => element.quizId === quiz.id)) {
        console.log("hello");
        const connectQuiz = await prisma.question.update({
          where: {
            id: question.id,
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

      const existingAnswers = await prisma.answer.findMany({
        where: {
          value: {
            equals: correctAnswer,
          },
        },
        include: {
          questions: true,
        },
      });
      let answer = existingAnswers[0];

      if (!answer) {
        answer = await prisma.answer.create({
          data: {
            buttonLabel: correctAnswer,
            value: correctAnswer,
          },
          include: {
            questions: true,
          },
        });
      }

      if (
        !answer.questions.some((element) => element.questionId === question.id)
      ) {
        const connectQuestion = await prisma.answer.update({
          where: {
            id: answer.id,
          },
          data: {
            questions: {
              create: {
                question: {
                  connect: { id: question.id },
                },
              },
            },
          },
        });
      }
    });

    for (i = 1; i <= 3; i++) {
      //Find questions for quiz for a specific question type
      const relevantQuestions = await prisma.question.findMany({
        where: {
          questionType: i,
          quizes: {
            every: {
              quizId: quiz.id,
            },
          },
        },
        include: {
          answers: true,
        },
      });

      //Find answers from the same quiz for a specific question type
      const potentialAnswers = await prisma.answer.findMany({
        where: {
          questions: {
            some: {
              question: {
                questionType: i,
                quizes: {
                  every: {
                    quizId: quiz.id,
                  },
                },
              },
            },
          },
        },
      });
      console.log("potentialAnswers", potentialAnswers);

      //Connect questions and answers
      relevantQuestions.forEach((question) => {
        const existingAnswerId = question.answers[0].id;
        let count = question.answers.length;
        console.log("question.answers", question.answers.length);
        potentialAnswers
          .sort((a, b) => 0.5 - Math.random())
          .forEach(async (answer, index) => {
            if (count === 4) return;
            if (answer.id === existingAnswerId) return;
            count++;
            console.log("question", question.question_word);
            console.log("answer", answer.value);
            const updatedQuestion = await prisma.answersOnQuestions.upsert({
              where: {
                answerId_questionId: {
                  // Unique compound key (adjust based on your schema if needed)
                  answerId: answer.id,
                  questionId: question.id,
                },
              },
              update: {}, // No need to update anything if the relation already exists
              create: {
                question: {
                  connect: { id: question.id }, // Connect the existing question
                },
                answer: {
                  connect: { id: answer.id }, // Connect the existing answer
                },
              },
            });
          });
      });
    }
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
