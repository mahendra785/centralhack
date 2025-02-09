"use client";

import { useState } from "react";
import { proccessImageAndSave } from "../actions/proccessImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function FileUploadTest() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [composition, setComposition] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setUploadedUrl(null);
      setImage(null);
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
      setAnalysis(res.analysis);
      setComposition(Array.isArray(res.compositions) ? res.compositions : []);
      setUploadedUrl(data.url);
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Image Analysis Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Upload className="h-8 w-8 text-gray-400" />
              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Choose a file or drag and drop
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={uploading}
                />
              </label>
              {file && (
                <p className="text-sm text-gray-500">Selected: {file.name}</p>
              )}
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full sm:w-auto"
              >
                {uploading ? "Processing..." : "Upload and Analyze"}
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {(uploadedUrl || image) && (
        <Card>
          <CardHeader>
            <CardTitle>Image Comparison</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Original Image
              </h3>
              <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-2 aspect-video flex items-center justify-center">
                <img
                  src={uploadedUrl || (file ? URL.createObjectURL(file) : "")}
                  alt="Original"
                  className="object-contain max-h-full max-w-full rounded"
                />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Processed Image
              </h3>
              <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-2 aspect-video flex items-center justify-center">
                {image ? (
                  <img
                    src={image}
                    alt="Processed"
                    className="object-contain max-h-full max-w-full rounded"
                  />
                ) : (
                  <p className="text-gray-400 text-sm">Processing...</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Weight
              </p>
              <p className="text-2xl font-semibold">
                {analysis.totalWeightKg} kg
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Waste Coverage
              </p>
              <p className="text-2xl font-semibold">
                {analysis.wasteCoverage}%
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Distribution Evenness
              </p>
              <p className="text-2xl font-semibold">
                {analysis.distributionEvenness}%
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {composition.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Composition Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {composition.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 grid md:grid-cols-4 gap-4"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Type
                    </p>
                    <p className="font-semibold">{item.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Pixel Count
                    </p>
                    <p className="font-semibold">{item.pixelCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Area
                    </p>
                    <p className="font-semibold">{item.areaPercentage}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Est. Weight
                    </p>
                    <p className="font-semibold">{item.estimatedWeightKg} kg</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
