/*
  Warnings:

  - Made the column `routeCode` on table `routes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "routes" ALTER COLUMN "routeCode" SET NOT NULL;
