-- CreateTable
CREATE TABLE "Streak" (
    "id" SERIAL NOT NULL,
    "current_streak" INTEGER NOT NULL,
    "last_active_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Streak_pkey" PRIMARY KEY ("id")
);
