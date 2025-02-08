"use server"
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/(auth)/auth";
import { processImage } from "@/utils/ml-actions/proccessImage";

export async function proccessImageAndSave(imageId: string) {
    const session = await auth();
    const user = session?.user;
    if (!user?.id) {
       return {
        status: "error",
        message: "Unauthorized"
       }
    }
    const image = await prisma.image.findUnique({
        where: {
            id: imageId,
            userId: user.id
        }
    });

    const imageUrl = image?.imageUrl;
    if (!imageUrl) {
        return {
            status: "error",
            message: "Image not found"
        }
    }

    const {processedImageUrl, analysis} = await processImage(imageUrl, imageId, user.id, image.name);

    return {
        status: "success",
        message: "Image proccessed successfully",
        proccessImage: processedImageUrl,
       // analysis: analysis
    };
}