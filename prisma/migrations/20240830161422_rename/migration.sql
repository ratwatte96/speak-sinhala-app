/*
  Warnings:

  - You are about to drop the column `question` on the `Quiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "question",
ADD COLUMN     "question_name" TEXT;
