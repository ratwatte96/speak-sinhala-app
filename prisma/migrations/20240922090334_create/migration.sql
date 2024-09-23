-- CreateTable
CREATE TABLE "Pair" (
    "id" SERIAL NOT NULL,
    "english" TEXT NOT NULL,
    "sinhala" TEXT,
    "sound" TEXT,

    CONSTRAINT "Pair_pkey" PRIMARY KEY ("id")
);
