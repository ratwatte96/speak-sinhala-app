-- CreateTable
CREATE TABLE "Refill" (
    "id" SERIAL NOT NULL,
    "total_refill" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "Refill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefillsOnUsers" (
    "refillId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "RefillsOnUsers_pkey" PRIMARY KEY ("refillId","userId")
);

-- AddForeignKey
ALTER TABLE "RefillsOnUsers" ADD CONSTRAINT "RefillsOnUsers_refillId_fkey" FOREIGN KEY ("refillId") REFERENCES "Refill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefillsOnUsers" ADD CONSTRAINT "RefillsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
