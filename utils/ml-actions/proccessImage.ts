import { prisma } from '@/lib/prisma';
import { projectClient } from '@/lib/bucket-client';

export async function processImage(imageUrl: string, imageId: string, userId: string, imageName: string) {
    try {
        // Send the image to ML server
        const response = await fetch(`${process.env.ML_SERVER_URL}/analyze-waste`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image_url: imageUrl }),
        });

        const data = await response.json();
        
        // Convert base64 to buffer
        const base64Image = data.visualisation.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Image, 'base64');
        
        // Upload processed image to bucket
        const processedImageFileName = `${Date.now()}-${userId}-processed-${imageName}.png`;
        const processedImageUrl = await projectClient.uploadFile(
            buffer,
            processedImageFileName
        );

        // Save analysis results to database
        const analysis = await prisma.wasteAnalysis.create({
            data: {
                imageId,
                totalWeightKg: data.total_stats.total_weight_kg,
                wasteCoverage: data.total_stats.waste_coverage,
                distributionEvenness: data.total_stats.distribution_evenness,
                compositions: {
                    create: [
                        {
                            type: 'RIGID_PLASTIC',
                            present: data.waste_composition.rigid_plastic.present,
                            pixelCount: data.waste_composition.rigid_plastic.pixel_count,
                            areaPercentage: data.waste_composition.rigid_plastic.area_percentage,
                            estimatedWeightKg: data.waste_composition.rigid_plastic.estimated_weight_kg,
                        },
                        {
                            type: 'CARDBOARD',
                            present: data.waste_composition.cardboard.present,
                            pixelCount: data.waste_composition.cardboard.pixel_count,
                            areaPercentage: data.waste_composition.cardboard.area_percentage,
                            estimatedWeightKg: data.waste_composition.cardboard.estimated_weight_kg,
                        },
                        {
                            type: 'METAL',
                            present: data.waste_composition.metal.present,
                            pixelCount: data.waste_composition.metal.pixel_count,
                            areaPercentage: data.waste_composition.metal.area_percentage,
                            estimatedWeightKg: data.waste_composition.metal.estimated_weight_kg,
                        },
                        {
                            type: 'SOFT_PLASTIC',
                            present: data.waste_composition.soft_plastic.present,
                            pixelCount: data.waste_composition.soft_plastic.pixel_count,
                            areaPercentage: data.waste_composition.soft_plastic.area_percentage,
                            estimatedWeightKg: data.waste_composition.soft_plastic.estimated_weight_kg,
                        },
                    ],
                },
            },
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
