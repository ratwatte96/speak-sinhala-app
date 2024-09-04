/*
  Warnings:

  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnswersOnQuestions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lives` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionsOnQuizes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quiz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Streak` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnswersOnQuestions" DROP CONSTRAINT "AnswersOnQuestions_answerId_fkey";

-- DropForeignKey
ALTER TABLE "AnswersOnQuestions" DROP CONSTRAINT "AnswersOnQuestions_questionId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionsOnQuizes" DROP CONSTRAINT "QuestionsOnQuizes_questionId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionsOnQuizes" DROP CONSTRAINT "QuestionsOnQuizes_quizId_fkey";

-- DropTable
DROP TABLE "Answer";

-- DropTable
DROP TABLE "AnswersOnQuestions";

-- DropTable
DROP TABLE "Lives";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "QuestionsOnQuizes";

-- DropTable
DROP TABLE "Quiz";

-- DropTable
DROP TABLE "Streak";

-- DropTable
DROP TABLE "Todo";

-- DropTable
DROP TABLE "User";
