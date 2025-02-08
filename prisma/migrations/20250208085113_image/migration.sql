/*
  Warnings:

  - You are about to drop the column `proccessedImageUrl` on the `Image` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "WasteType" AS ENUM ('RIGID_PLASTIC', 'CARDBOARD', 'METAL', 'SOFT_PLASTIC');

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_userId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "proccessedImageUrl",
ADD COLUMN     "processedImageUrl" TEXT;

-- CreateTable
CREATE TABLE "WasteAnalysis" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "totalWeightKg" DOUBLE PRECISION NOT NULL,
    "wasteCoverage" DOUBLE PRECISION NOT NULL,
    "distributionEvenness" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WasteAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteComposition" (
    "id" TEXT NOT NULL,
    "wasteAnalysisId" TEXT NOT NULL,
    "type" "WasteType" NOT NULL,
    "present" BOOLEAN NOT NULL,
    "pixelCount" INTEGER NOT NULL,
    "areaPercentage" DOUBLE PRECISION NOT NULL,
    "estimatedWeightKg" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WasteComposition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WasteAnalysis_imageId_key" ON "WasteAnalysis"("imageId");

-- CreateIndex
CREATE INDEX "WasteComposition_wasteAnalysisId_idx" ON "WasteComposition"("wasteAnalysisId");

-- CreateIndex
CREATE INDEX "Image_userId_idx" ON "Image"("userId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteAnalysis" ADD CONSTRAINT "WasteAnalysis_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteComposition" ADD CONSTRAINT "WasteComposition_wasteAnalysisId_fkey" FOREIGN KEY ("wasteAnalysisId") REFERENCES "WasteAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
