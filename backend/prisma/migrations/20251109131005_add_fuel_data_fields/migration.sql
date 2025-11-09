-- AlterTable
ALTER TABLE "routes" ADD COLUMN     "fuelConsumptionTonnes" DOUBLE PRECISION,
ADD COLUMN     "fuelType" TEXT,
ADD COLUMN     "ghgIntensity" DOUBLE PRECISION,
ADD COLUMN     "year" INTEGER;
