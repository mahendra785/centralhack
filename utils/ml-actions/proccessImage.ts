import { prisma } from '@/lib/prisma';
import { projectClient } from '@/lib/bucket-client';

export async function processImage(imageUrl: string, imageId: string, userId: string, imageName: string) {
    try {
        const response = await fetch(`${process.env.ML_SERVER_URL}/analyze-waste`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image_url: imageUrl }),
        });

        const data = await response.json();
        
        const base64Image = data.visualization.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Image, 'base64');

        const processedImageFileName = `${Date.now()}-${userId}-processed-${imageName}.png`;
        const processedImageUrl = await projectClient.uploadFile(
            buffer,
            processedImageFileName
        );


        const analysis = await prisma.wasteAnalysisOfImage.create({
            data: {
                imageId,
                totalWeightKg: data.analytics.total_stats.total_weight_kg,
                wasteCoverage: data.analytics.total_stats.waste_coverage,
                distributionEvenness: data.analytics.total_stats.distribution_evenness,
            },
        });

        await prisma.wasteCompositionOfImage.createMany({
            data: [
                {
                    wasteAnalysisOfImageId: analysis.id,
                    type: 'RIGID_PLASTIC',
                    present: data.analytics.waste_composition.rigid_plastic.present,
                    pixelCount: data.analytics.waste_composition.rigid_plastic.pixel_count,
                    areaPercentage: data.analytics.waste_composition.rigid_plastic.area_percentage,
                    estimatedWeightKg: data.analytics.waste_composition.rigid_plastic.estimated_weight_kg,
                },
                {
                    wasteAnalysisOfImageId: analysis.id,
                    type: 'CARDBOARD',
                    present: data.analytics.waste_composition.cardboard.present,
                    pixelCount: data.analytics.waste_composition.cardboard.pixel_count,
                    areaPercentage: data.analytics.waste_composition.cardboard.area_percentage,
                    estimatedWeightKg: data.analytics.waste_composition.cardboard.estimated_weight_kg,
                },
                {
                    wasteAnalysisOfImageId: analysis.id,
                    type: 'METAL',
                    present: data.analytics.waste_composition.metal.present,
                    pixelCount: data.analytics.waste_composition.metal.pixel_count,
                    areaPercentage: data.analytics.waste_composition.metal.area_percentage,
                    estimatedWeightKg: data.analytics.waste_composition.metal.estimated_weight_kg,
                },
                {
                    wasteAnalysisOfImageId: analysis.id,
                    type: 'SOFT_PLASTIC',
                    present: data.analytics.waste_composition.soft_plastic.present,
                    pixelCount: data.analytics.waste_composition.soft_plastic.pixel_count,
                    areaPercentage: data.analytics.waste_composition.soft_plastic.area_percentage,
                    estimatedWeightKg: data.analytics.waste_composition.soft_plastic.estimated_weight_kg,
                },
            ],
        });

        await prisma.image.update({
            where: { id: imageId },
            data: { processedImageUrl }
        });

        return {
            processedImageUrl,
            analysis
        };
    } catch (error) {
        console.error("Error analyzing waste:", error);
        throw error;
    }
}