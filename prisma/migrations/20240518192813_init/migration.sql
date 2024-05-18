/*
  Warnings:

  - Added the required column `balance` to the `BankAccountUser` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "BankAccountUser" ADD COLUMN     "balance" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);
