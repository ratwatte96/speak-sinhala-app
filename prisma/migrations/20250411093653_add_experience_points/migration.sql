-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalExperiencePoints" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ExperiencePoints" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ExperiencePoints_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExperiencePoints_userId_date_key" ON "ExperiencePoints"("userId", "date");

-- AddForeignKey
ALTER TABLE "ExperiencePoints" ADD CONSTRAINT "ExperiencePoints_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
