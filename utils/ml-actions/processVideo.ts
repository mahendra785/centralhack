export async function uploadVideo(videoUrl: string) {
    try {

        const response = await fetch(`${process.env.ML_SERVER_URL}/analyze-video`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                 video_url: videoUrl 
                }),
        });

        const data = await response.json();

        return {
            status: 'success',
            data: data
        }
    } catch (error) {
        console.error("Error analyzing waste:", error);
        throw error;
    }
}
