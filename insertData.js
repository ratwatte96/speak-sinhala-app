const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const quizQuestion = "Consonants";
  const dataPairs = [
    ["ka", "ක"],
    ["kha", "ඛ"],
    ["ga", "ග"],
    ["gha", "ඝ"],
    ["nga", "ඞ"],
    ["ṅga", "ඟ"],
    ["ca", "ච"],
    ["cha", "ඡ"],
    ["ja", "ජ"],
    ["jha", "ඣ"],
    ["ñya", "ඤ"],
    ["jñya", "ඥ"],
    ["ñja", "ඦ"],
    ["ṭa", "ට"],
    ["ṭha", "ඨ"],
    ["ḍa", "ඩ"],
    ["ḍha", "ඪ"],
    ["ṇa", "ණ"],
    ["ṇḍa", "ඬ"],
    ["ta", "ත"],
    ["tha", "ථ"],
    ["da", "ද"],
    ["dha", "ධ"],
    ["na", "න"],
    ["nda", "ඳ"],
    ["pa", "ප"],
    ["pha", "ඵ"],
    ["ba", "බ"],
    ["bha", "භ"],
    ["ma", "ම"],
    ["mba", "ඹ"],
    ["ya", "ය"],
    ["ra", "ර"],
    ["la", "ල"],
    ["va", "ව"],
    ["śa", "ශ"],
    ["ṣa", "ෂ"],
    ["ṣa", "ක්‍ෂ"],
    ["sa", "ස"],
    ["ha", "හ"],
    ["ḷa", "ළ"],
    ["fa", "ෆ"],
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
    dataPairs.forEach((pair) => {
      pair.forEach(async (element, i) => {
        const existingQuestions = await prisma.question.findMany({
          where: {
            correctAnswer: {
              equals: element,
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
              question_word: i === 0 ? pair[1] : pair[0],
              correctAnswer: element,
              questionType: i + 1,
            },
            include: {
              quizes: true,
            },
          });
        }

        if (question.quizes.length === 0) {
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
              equals: element,
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
              buttonLabel: element,
              value: element,
            },
            include: {
              questions: true,
            },
          });
        }

        if (answer.questions.length === 0) {
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
    });

    for (i = 1; i <= 2; i++) {
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
            every: {
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
