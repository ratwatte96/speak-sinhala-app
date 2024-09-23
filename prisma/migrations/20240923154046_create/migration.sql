-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "question_word" DROP NOT NULL,
ALTER COLUMN "correctAnswer" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PairsOnQuestions" (
    "pairId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "PairsOnQuestions_pkey" PRIMARY KEY ("pairId","questionId")
);

-- AddForeignKey
ALTER TABLE "PairsOnQuestions" ADD CONSTRAINT "PairsOnQuestions_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairsOnQuestions" ADD CONSTRAINT "PairsOnQuestions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
