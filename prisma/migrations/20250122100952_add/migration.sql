-- CreateTable
CREATE TABLE "StreaksOnUsers" (
    "streaksId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "StreaksOnUsers_pkey" PRIMARY KEY ("streaksId","userId")
);

-- AddForeignKey
ALTER TABLE "StreaksOnUsers" ADD CONSTRAINT "StreaksOnUsers_streaksId_fkey" FOREIGN KEY ("streaksId") REFERENCES "Streak"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreaksOnUsers" ADD CONSTRAINT "StreaksOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
