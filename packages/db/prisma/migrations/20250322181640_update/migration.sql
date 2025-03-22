/*
  Warnings:

  - You are about to drop the column `connection` on the `Website` table. All the data in the column will be lost.
  - You are about to drop the column `dataTransfer` on the `Website` table. All the data in the column will be lost.
  - You are about to drop the column `tlsHandshake` on the `Website` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Website` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Website" DROP COLUMN "connection",
DROP COLUMN "dataTransfer",
DROP COLUMN "tlsHandshake",
DROP COLUMN "total";

-- AlterTable
ALTER TABLE "WebsiteTicksTable" ADD COLUMN     "connection" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dataTransfer" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tlsHandshake" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total" INTEGER NOT NULL DEFAULT 0;
