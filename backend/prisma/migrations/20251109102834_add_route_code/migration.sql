/*
  Warnings:

  - A unique constraint covering the columns `[routeCode]` on the table `routes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "routes" ADD COLUMN     "routeCode" TEXT;

-- Update existing rows to set routeCode based on name
UPDATE "routes" SET "routeCode" = "name" WHERE "routeCode" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "routes_routeCode_key" ON "routes"("routeCode");
