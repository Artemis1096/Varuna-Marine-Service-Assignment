/*
  Warnings:

  - You are about to drop the column `baseline` on the `routes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "routes" DROP COLUMN "baseline",
ADD COLUMN     "is_baseline" BOOLEAN NOT NULL DEFAULT false;
