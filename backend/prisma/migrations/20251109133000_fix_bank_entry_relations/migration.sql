/*
  Warnings:

  - You are about to drop the column `shipComplianceId` on the `bank_entries` table. All the data in the column will be lost.
  - You are about to drop the column `shipId` on the `bank_entries` table. All the data in the column will be lost.
  - Added the required column `routeCode` to the `bank_entries` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bank_entries" DROP CONSTRAINT "bank_entries_shipComplianceId_fkey";

-- AlterTable
ALTER TABLE "bank_entries" DROP COLUMN "shipComplianceId",
DROP COLUMN "shipId",
ADD COLUMN     "routeCode" TEXT NOT NULL;
