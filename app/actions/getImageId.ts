
"use server"
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/(auth)/auth";
export async function getImageID(imageUrl: string) {
    const Image = await prisma.image.findUnique({
        where: {
          imageUrl: imageUrl
        }
      });
  
    return {
        status: "success",
        message: "Organization created successfully",
        data: Image.id
    };
}

export async function getImages() {
    const images = await prisma.image.findMany({
      });
  
    return {
        status: "success",
        message: "Organization created successfully",
        data: images
    };
}
