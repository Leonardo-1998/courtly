-- CreateTable
CREATE TABLE "Topup" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "midtransId" TEXT,

    CONSTRAINT "Topup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Topup" ADD CONSTRAINT "Topup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topup" ADD CONSTRAINT "Topup_midtransId_fkey" FOREIGN KEY ("midtransId") REFERENCES "Midtrans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
