"use client";
import React, { useState, useEffect } from "react";
import { getImages } from "../actions/getImageId";

interface ImageData {
  processedImageUrl: string;
}

const ImageList = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const images = await getImages();
      setImages(images.data);
    } catch (err) {
      console.error("Failed to fetch images:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {images.map((image, index) =>
            image.processedImageUrl ? (
              <li key={index}>
                <img src={image.processedImageUrl} alt={`Image ${index}`} />
              </li>
            ) : null
          )}
        </ul>
      )}
    </div>
  );
};

export default ImageList;
