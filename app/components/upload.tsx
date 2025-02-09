"use client";

import { useState } from "react";
import { proccessImageAndSave } from "../actions/proccessImage";
import { auth } from "../(auth)/auth";
import { prisma } from "../../lib/prisma";

export default function FileUploadTest() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setUploadedUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const res = await proccessImageAndSave(data.image.id);

      setImage(res.proccessImage || null);
      setUploadedUrl(data.url);
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  async function getImageAnalysis(imageId: string) {
    const session = await auth();
    if (!session?.user?.email) return [];

    try {
      const analysis = await prisma.wasteAnalysisOfImage.findMany({
        where: {
          imageId: imageId,
        },
      });
      return analysis ?? [];
    } catch (error) {
      console.error("Error fetching videos:", error);
      return [];
    } finally {
      await prisma.$disconnect();
    }
  }

  const colorSchemeItems = [
    { color: "rgb(255, 0, 0)", label: "Hard Plastic" },
    { color: "rgb(0, 255, 0)", label: "Cardboard" },
    { color: "#4241B8", label: "Metal" },
    { color: "#713472", label: "Soft Plastic" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="space-y-6">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-100">
              Upload File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={uploading}
            />
          </div>
          {file && (
            <div className="mt-4">
              <p className="text-sm text-gray-300">
                Selected file: {file.name}
              </p>
            </div>
          )}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Preview and Color Scheme Section */}
        {(uploadedUrl || image || (file && file.type.startsWith("image/"))) && (
          <div className="flex flex-row gap-8">
            {/* Image Preview */}
            <div className="flex-1">
              <div className="rounded-md bg-gray-800 p-4">
                <img
                  src={
                    uploadedUrl ||
                    image ||
                    (file ? URL.createObjectURL(file) : "")
                  }
                  alt="Preview"
                  className="object-contain w-full h-64"
                />
              </div>
            </div>

            {/* Color Scheme Legend */}
            <div className="w-64 bg-gray-800 p-6 rounded-md">
              <h3 className="text-lg font-semibold text-white mb-4">
                Color Scheme
              </h3>
              <div className="space-y-4">
                {colorSchemeItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="h-4 w-4 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-200">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
