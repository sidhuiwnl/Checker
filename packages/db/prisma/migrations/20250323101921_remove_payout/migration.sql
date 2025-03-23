/*
  Warnings:

  - You are about to drop the column `pendingPayouts` on the `Validator` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Validator" DROP COLUMN "pendingPayouts";
