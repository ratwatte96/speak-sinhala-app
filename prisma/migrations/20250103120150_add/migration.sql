-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "unit_name" TEXT NOT NULL,
    "order" JSONB,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizesOnUnits" (
    "quizId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,

    CONSTRAINT "QuizesOnUnits_pkey" PRIMARY KEY ("quizId","unitId")
);

-- AddForeignKey
ALTER TABLE "QuizesOnUnits" ADD CONSTRAINT "QuizesOnUnits_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizesOnUnits" ADD CONSTRAINT "QuizesOnUnits_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
