/*
  Warnings:

  - You are about to drop the `NewLetterData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NewLetterDatasOnQuizes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NewLetterDatasOnQuizes" DROP CONSTRAINT "NewLetterDatasOnQuizes_newLetterDataId_fkey";

-- DropForeignKey
ALTER TABLE "NewLetterDatasOnQuizes" DROP CONSTRAINT "NewLetterDatasOnQuizes_quizId_fkey";

-- DropTable
DROP TABLE "NewLetterData";

-- DropTable
DROP TABLE "NewLetterDatasOnQuizes";
