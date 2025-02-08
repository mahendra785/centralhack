"use client";
import { useState } from "react";
import { revalidateUpload } from "../(auth)/authactions/revalidate";
export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];

      if (selectedFile.type !== "video/mp4") {
        setMessage("Only .mp4 files are allowed.");
        return;
      }

      setFile(selectedFile);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a .mp4 file first.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Uploading file...");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      console.log(response);
      const result = await response.json();
      console.log(result);
      await revalidateUpload();
      if (response.ok) {
        setMessage(`Movie uploaded successfully: ${result.filename}`);
      } else {
        setMessage(`Upload failed: ${result.message}`);
      }
    } catch (error) {
      setMessage("An error occurred while uploading.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-4">Upload a Movie (.mp4)</h1>
        <input
          type="file"
          accept="video/mp4"
          onChange={handleFileChange}
          className="mb-4 p-2 w-full border rounded"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`px-4 py-2 text-white rounded w-full ${
            uploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {progress > 0 && (
          <p className="mt-2 text-gray-700">Upload Progress: {progress}%</p>
        )}
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
