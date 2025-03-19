/*
  Warnings:

  - Added the required column `disabled` to the `Website` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "disabled" BOOLEAN NOT NULL;
