// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { prisma } from "@/lib/prisma";
// import { auth } from "../(auth)/auth";
// type VideoStatus = "idle" | "processing" | "processed";

// async function getVideos() {
//   "use server";
//   const session = await auth();
//   if (!session?.user?.email) return [];

//   try {
//     const videos = await prisma.video.findMany({
//       where: { userId: session.user.id },
//     });
//     return videos ?? [];
//   } catch (error) {
//     console.error("Error fetching team members:", error);
//     return [];
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export default function VideoGallery() {
//   const router = useRouter();
//   const [files, setFiles] = useState<File[]>([]);
//   const [progress, setProgress] = useState<number[]>([]);
//   const [status, setStatus] = useState<VideoStatus[]>([]);
//   const [thumbnails, setThumbnails] = useState<string[]>([]);
//   const [videoUrls, setVideoUrls] = useState<string[]>([]);

//   const generateThumbnail = (file: File) => {
//     return new Promise<string>((resolve) => {
//       const video = document.createElement("video");
//       video.preload = "metadata";
//       video.src = URL.createObjectURL(file);
//       video.onloadeddata = () => {
//         const canvas = document.createElement("canvas");
//         canvas.width = 160;
//         canvas.height = 90;
//         const ctx = canvas.getContext("2d");
//         if (ctx) {
//           video.currentTime = 1;
//           video.onseeked = () => {
//             ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//             resolve(canvas.toDataURL());
//             URL.revokeObjectURL(video.src);
//           };
//         }
//       };
//     });
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const selectedFiles = Array.from(e.target.files);
//       setFiles(selectedFiles);
//       setProgress(new Array(selectedFiles.length).fill(0));
//       setStatus(new Array(selectedFiles.length).fill("idle"));

//       // Generate thumbnails and video URLs
//       const newThumbnails = await Promise.all(
//         selectedFiles.map((file) => generateThumbnail(file))
//       );
//       setThumbnails(newThumbnails);

//       // Create video URLs
//       const urls = selectedFiles.map((file) => URL.createObjectURL(file));
//       setVideoUrls(urls);
//     }
//   };

//   const handleProcess = (index: number) => {
//     alert(`Processing video: ${files[index].name}`);
//     setStatus((prev) => {
//       const updatedStatus = [...prev];
//       updatedStatus[index] = "processing";
//       return updatedStatus;
//     });

//     let progressValue = 0;
//     const interval = setInterval(() => {
//       progressValue += 10;
//       setProgress((prev) => {
//         const updatedProgress = [...prev];
//         updatedProgress[index] = progressValue;
//         return updatedProgress;
//       });

//       if (progressValue >= 100) {
//         clearInterval(interval);
//         setStatus((prev) => {
//           const updatedStatus = [...prev];
//           updatedStatus[index] = "processed";
//           return updatedStatus;
//         });
//       }
//     }, 500);
//     // Uncomment below to integrate process function
//     // processVideoAndSave(files[index]);
//   };

//   const handleView = (index: number) => {
//     router.push(
//       `/viewVideo?url=${encodeURIComponent(
//         videoUrls[index]
//       )}&name=${encodeURIComponent(files[index].name)}`
//     );
//   };

//   const getStatusText = (status: VideoStatus) => {
//     switch (status) {
//       case "processing":
//         return "Processing...";
//       case "processed":
//         return "Video Processed";
//       default:
//         return "Ready to Process";
//     }
//   };

//   const getButtonStyles = (videoStatus: VideoStatus) => {
//     if (videoStatus === "processed") {
//       return "bg-green-600 hover:bg-green-700";
//     }
//     if (videoStatus === "processing") {
//       return "bg-yellow-600 hover:bg-yellow-700 cursor-not-allowed";
//     }
//     return "bg-blue-600 hover:bg-blue-700";
//   };

//   // Cleanup URLs when component unmounts
//   useEffect(() => {
//     return () => {
//       videoUrls.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [videoUrls]);

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="space-y-2">
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
//           <div className="space-y-4">
//             <label className="block text-lg font-semibold text-gray-100">
//               Upload Videos
//             </label>
//             <input
//               type="file"
//               accept="video/*"
//               multiple
//               onChange={handleFileChange}
//               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//           </div>
//         </div>
//         {files.length > 0 && (
//           <ul className="space-y-4 mt-4">
//             {files.map((file, index) => (
//               <li key={index} className="border p-4 rounded-md bg-gray-100">
//                 <div className="flex gap-4">
//                   <div className="flex-shrink-0">
//                     <div className="w-40 h-[90px] bg-gray-200 rounded overflow-hidden">
//                       {thumbnails[index] && (
//                         <img
//                           src={thumbnails[index]}
//                           alt={`Thumbnail for ${file.name}`}
//                           className="w-full h-full object-cover"
//                         />
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex-grow">
//                     <p className="text-gray-800 font-semibold">{file.name}</p>
//                     <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
//                       <div
//                         className="bg-blue-600 h-2.5 rounded-full"
//                         style={{ width: `${progress[index]}%` }}
//                       ></div>
//                     </div>
//                     <div className="flex justify-between items-center mt-2">
//                       <span className="text-sm text-gray-600">
//                         {getStatusText(status[index])}
//                       </span>
//                       <div className="space-x-2">
//                         <button
//                           onClick={() => handleProcess(index)}
//                           disabled={
//                             status[index] === "processing" ||
//                             status[index] === "processed"
//                           }
//                           className={`px-4 py-2 text-white rounded-md ${getButtonStyles(
//                             status[index]
//                           )}`}
//                         >
//                           {status[index] === "processed"
//                             ? "Processed"
//                             : "Process Video"}
//                         </button>
//                         {status[index] === "processed" && (
//                           <button
//                             onClick={() => handleView(index)}
//                             className="px-4 py-2 text-white rounded-md bg-indigo-600 hover:bg-indigo-700"
//                           >
//                             View
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }
import { prisma } from "@/lib/prisma";
import { auth } from "../(auth)/auth";

export default async function VideoGallery() {
  async function getVideos() {
    const session = await auth();
    if (!session?.user?.email) return [];

    try {
      const videos = await prisma.video.findMany({
        where: {
          userId: session.user.id,
        },
      });
      return videos ?? [];
    } catch (error) {
      console.error("Error fetching videos:", error);
      return [];
    } finally {
      await prisma.$disconnect();
    }
  }

  // Fetch the videos
  const videos = await getVideos();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-gray-800">Your Videos</h1>
        {videos.length === 0 ? (
          <p className="text-gray-600">No videos found.</p>
        ) : (
          <ul className="space-y-4">
            {videos.map((video) => (
              <li
                key={video.videoUrl} // Use the unique video URL as the key
                className="border p-4 rounded-md bg-gray-100"
              >
                <div className="flex gap-4">
                  <div className="flex-grow">
                    <p className="text-gray-800 font-semibold">{video.name}</p>
                    <p className="text-gray-600">{video.description}</p>
                    <video controls className="w-full mt-2">
                      <source src={video.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
