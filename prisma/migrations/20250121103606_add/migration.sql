-- CreateTable
CREATE TABLE "LivesOnUsers" (
    "livesId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LivesOnUsers_pkey" PRIMARY KEY ("livesId","userId")
);

-- AddForeignKey
ALTER TABLE "LivesOnUsers" ADD CONSTRAINT "LivesOnUsers_livesId_fkey" FOREIGN KEY ("livesId") REFERENCES "Lives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LivesOnUsers" ADD CONSTRAINT "LivesOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
