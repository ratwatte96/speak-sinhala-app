-- CreateTable
CREATE TABLE "Lives" (
    "id" SERIAL NOT NULL,
    "total_lives" INTEGER NOT NULL DEFAULT 0,
    "last_active_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lives_pkey" PRIMARY KEY ("id")
);
