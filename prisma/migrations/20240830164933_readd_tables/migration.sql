-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "quiz_name" TEXT NOT NULL,
    "sinhala" TEXT,
    "audio" TEXT,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "question_word" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "questionType" INTEGER NOT NULL,
    "audio" TEXT,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionsOnQuizes" (
    "questionId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,

    CONSTRAINT "QuestionsOnQuizes_pkey" PRIMARY KEY ("questionId","quizId")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "buttonLabel" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sinhala" TEXT,
    "audio" TEXT,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnswersOnQuestions" (
    "answerId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "AnswersOnQuestions_pkey" PRIMARY KEY ("answerId","questionId")
);

-- AddForeignKey
ALTER TABLE "QuestionsOnQuizes" ADD CONSTRAINT "QuestionsOnQuizes_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionsOnQuizes" ADD CONSTRAINT "QuestionsOnQuizes_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswersOnQuestions" ADD CONSTRAINT "AnswersOnQuestions_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswersOnQuestions" ADD CONSTRAINT "AnswersOnQuestions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
