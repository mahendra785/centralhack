import { prisma } from "@/lib/prisma";
import { auth } from "../(auth)/auth";
import { uploadVideo } from "@/utils/ml-actions/processVideo";

export async function processVideo(videoId: string) {
    const session = await auth();
    const user = session?.user;
    if (!user?.id) {
       return {
        status: "error",
        message: "Unauthorized"
       }
    }
    const video = await prisma.video.findUnique({
        where: {
            id: videoId,
            userId: user.id
        }
    });

    const videoUrl = video?.videoUrl;
    if (!videoUrl) {
        return {
            status: "error",
            message: "Video not found"
        }
    }

    const response = await uploadVideo(videoUrl)
    if (response.status !== 'success') {
        return {
            status: "error",
            messag: "Error uploading video to ML"
        }
    }

    return {
        status: "success",
        message: "Video Uploaded"
    }
}