-- CreateEnum
CREATE TYPE "Status" AS ENUM ('GOOD', 'BAD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Website" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Validator" (
    "id" TEXT NOT NULL,
    "publickey" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "ip" TEXT NOT NULL,

    CONSTRAINT "Validator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteTicksTable" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "validatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL,
    "latency" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WebsiteTicksTable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WebsiteTicksTable" ADD CONSTRAINT "WebsiteTicksTable_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteTicksTable" ADD CONSTRAINT "WebsiteTicksTable_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "Validator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
