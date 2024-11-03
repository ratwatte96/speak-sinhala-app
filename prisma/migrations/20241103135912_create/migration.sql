-- CreateTable
CREATE TABLE "PairsOnQuizes" (
    "pairId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,

    CONSTRAINT "PairsOnQuizes_pkey" PRIMARY KEY ("pairId","quizId")
);

-- AddForeignKey
ALTER TABLE "PairsOnQuizes" ADD CONSTRAINT "PairsOnQuizes_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairsOnQuizes" ADD CONSTRAINT "PairsOnQuizes_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
