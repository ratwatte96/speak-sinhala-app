-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "audio" TEXT,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "phonetic" TEXT NOT NULL,
    "quizId" INTEGER NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "audio" TEXT,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "answerId" INTEGER NOT NULL,
    "buttonLabel" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sinhala" TEXT,
    "audio" TEXT,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
