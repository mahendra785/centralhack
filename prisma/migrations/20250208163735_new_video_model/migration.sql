/*
  Warnings:

  - You are about to drop the `WasteAnalysis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WasteComposition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WasteAnalysis" DROP CONSTRAINT "WasteAnalysis_imageId_fkey";

-- DropForeignKey
ALTER TABLE "WasteComposition" DROP CONSTRAINT "WasteComposition_wasteAnalysisId_fkey";

-- DropTable
DROP TABLE "WasteAnalysis";

-- DropTable
DROP TABLE "WasteComposition";

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "videoUrl" TEXT NOT NULL,
    "processedVideoUrl" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteAnalysisOfImage" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "totalWeightKg" DOUBLE PRECISION NOT NULL,
    "wasteCoverage" DOUBLE PRECISION NOT NULL,
    "distributionEvenness" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WasteAnalysisOfImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteCompositionOfImage" (
    "id" TEXT NOT NULL,
    "wasteAnalysisOfImageId" TEXT NOT NULL,
    "type" "WasteType" NOT NULL,
    "present" BOOLEAN NOT NULL,
    "pixelCount" INTEGER NOT NULL,
    "areaPercentage" DOUBLE PRECISION NOT NULL,
    "estimatedWeightKg" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WasteCompositionOfImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteAnalysisOfVideo" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "totalWeightKg" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WasteAnalysisOfVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteCompositionOfVideo" (
    "id" TEXT NOT NULL,
    "wasteAnalysisOfVideoId" TEXT NOT NULL,
    "type" "WasteType" NOT NULL,
    "present" BOOLEAN NOT NULL,
    "estimatedWeightKg" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WasteCompositionOfVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Video_userId_idx" ON "Video"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WasteAnalysisOfImage_imageId_key" ON "WasteAnalysisOfImage"("imageId");

-- CreateIndex
CREATE INDEX "WasteCompositionOfImage_wasteAnalysisOfImageId_idx" ON "WasteCompositionOfImage"("wasteAnalysisOfImageId");

-- CreateIndex
CREATE UNIQUE INDEX "WasteAnalysisOfVideo_videoId_key" ON "WasteAnalysisOfVideo"("videoId");

-- CreateIndex
CREATE INDEX "WasteCompositionOfVideo_wasteAnalysisOfVideoId_idx" ON "WasteCompositionOfVideo"("wasteAnalysisOfVideoId");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteAnalysisOfImage" ADD CONSTRAINT "WasteAnalysisOfImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteCompositionOfImage" ADD CONSTRAINT "WasteCompositionOfImage_wasteAnalysisOfImageId_fkey" FOREIGN KEY ("wasteAnalysisOfImageId") REFERENCES "WasteAnalysisOfImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteAnalysisOfVideo" ADD CONSTRAINT "WasteAnalysisOfVideo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteCompositionOfVideo" ADD CONSTRAINT "WasteCompositionOfVideo_wasteAnalysisOfVideoId_fkey" FOREIGN KEY ("wasteAnalysisOfVideoId") REFERENCES "WasteAnalysisOfVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
