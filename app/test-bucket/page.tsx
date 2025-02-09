"use client";

import { useState } from 'react';

export default function FileUploadTest() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setUploadedUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadedUrl(data.url);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
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
              <p className="text-sm text-gray-500">
                Selected file: {file.name}
              </p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {uploadedUrl && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-700">File uploaded successfully!</p>
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-sm text-blue-600 hover:underline break-all"
            >
              {uploadedUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}