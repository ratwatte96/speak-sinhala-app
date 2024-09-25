-- CreateTable
CREATE TABLE "NewLetterData" (
    "id" SERIAL NOT NULL,
    "englishWord" TEXT NOT NULL,
    "sinhala" TEXT NOT NULL,
    "sound" TEXT NOT NULL,

    CONSTRAINT "NewLetterData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewLetterDatasOnQuizes" (
    "newLetterDataId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,

    CONSTRAINT "NewLetterDatasOnQuizes_pkey" PRIMARY KEY ("newLetterDataId","quizId")
);

-- AddForeignKey
ALTER TABLE "NewLetterDatasOnQuizes" ADD CONSTRAINT "NewLetterDatasOnQuizes_newLetterDataId_fkey" FOREIGN KEY ("newLetterDataId") REFERENCES "NewLetterData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewLetterDatasOnQuizes" ADD CONSTRAINT "NewLetterDatasOnQuizes_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
