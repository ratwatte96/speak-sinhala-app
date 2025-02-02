/*
  Warnings:

  - You are about to drop the column `incorrectAnswer` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "incorrectAnswer";

-- CreateTable
CREATE TABLE "UsersOnQuizes" (
    "userId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'locked',
    "completionCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UsersOnQuizes_pkey" PRIMARY KEY ("userId","quizId")
);

-- AddForeignKey
ALTER TABLE "UsersOnQuizes" ADD CONSTRAINT "UsersOnQuizes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnQuizes" ADD CONSTRAINT "UsersOnQuizes_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
