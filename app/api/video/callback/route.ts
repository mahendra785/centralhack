//user uploads a vido
//it is saved to google storage
//user clicks proccess
//we send video link of object in storage to the ML server
//they perform chunkwise analysis and hit a callback to the backend with video id and the metrics of the proccessing
//if the video metrics are not present add them first time
//then keep updating them
// app/api/video-analysis/callback/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WasteType } from '@prisma/client';

interface MLAnalysisPayload {
  videoId: string;
  totalWeightKg: number;
  compositions: {
    type: WasteType;
    present: boolean;
    estimatedWeightKg: number;
  }[];
}

export async function POST(request: Request) {
  try {

    const analysisData: MLAnalysisPayload = await request.json();

    if (!analysisData.videoId || !analysisData.compositions) {
      return NextResponse.json(
        { error: 'Invalid payload structure' },
        { status: 400 }
      );
    }

    // Check if analysis already exists for this video
    const existingAnalysis = await prisma.wasteAnalysisOfVideo.findUnique({
      where: { videoId: analysisData.videoId },
      include: { compositions: true }
    });

    if (existingAnalysis) {
      // Update existing analysis
      const updatedAnalysis = await prisma.wasteAnalysisOfVideo.update({
        where: { id: existingAnalysis.id },
        data: {
          totalWeightKg: analysisData.totalWeightKg,
          compositions: {
            // Delete existing compositions
            deleteMany: {},
            // Create new compositions
            createMany: {
              data: analysisData.compositions
            }
          }
        },
        include: { compositions: true }
      });

      return NextResponse.json({
        message: 'Analysis updated successfully',
        data: updatedAnalysis
      });
    } else {
      // Create new analysis
      const newAnalysis = await prisma.wasteAnalysisOfVideo.create({
        data: {
          videoId: analysisData.videoId,
          totalWeightKg: analysisData.totalWeightKg,
          compositions: {
            createMany: {
              data: analysisData.compositions
            }
          }
        },
        include: { compositions: true }
      });

      return NextResponse.json({
        message: 'Analysis created successfully',
        data: newAnalysis
      });
    }
  } catch (error) {
    console.error('Error processing video analysis callback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}