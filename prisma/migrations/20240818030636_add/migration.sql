/*
  Warnings:

  - You are about to drop the column `answerId` on the `Answer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_answerId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quizId_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "answerId";

-- CreateTable
CREATE TABLE "QuestionsOnQuizes" (
    "questionId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,

    CONSTRAINT "QuestionsOnQuizes_pkey" PRIMARY KEY ("questionId","quizId")
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
