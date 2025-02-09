import {prisma} from "@/lib/prisma";
import {auth} from "@/app/(auth)/auth";
import { View } from "lucide-react";
import VideoGallery from "./viewVideos";

export default async function getVideos() {
    const session = await auth();
    if (!session?.user?.email) return [];
  
    try {
      const videos = await prisma.video.findMany({
        where: { userId: session.user.id },
      });
      return videos ?? [];
    } catch (error) {
      console.error("Error fetching team members:", error);
      return [];
    } finally {
      await prisma.$disconnect();
    }
  }
  
}
export default async function ViewVideosServer() {

  return (
    <VideoGallery videos/>
  );
}
