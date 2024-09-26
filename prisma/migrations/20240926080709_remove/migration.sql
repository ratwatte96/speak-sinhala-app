/*
  Warnings:

  - You are about to drop the column `order` on the `QuestionsOnQuizes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuestionsOnQuizes" DROP COLUMN "order";

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "order" JSONB;
