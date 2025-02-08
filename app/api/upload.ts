import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Disable Next.js body parser (important for file streaming)
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const uploadDir = path.join(process.cwd(), "public/uploads");
  const form = formidable({
    uploadDir: uploadDir, // Save files to local directory
    keepExtensions: true,
    maxFileSize: 500 * 1024 * 1024, // 500MB limit
  });

  // Ensure the uploads directory exists
  if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(form.uploadDir, { recursive: true });
  }

  // Parse the form
  interface UploadedFile {
    filepath: string;
    originalFilename?: string;
  }

  interface FormFiles {
    file?: UploadedFile[];
  }

  interface FormFields {
    [key: string]: string | string[];
  }

  form.parse(req, async (err: Error | null, fields: FormFields, files: FormFiles) => {
    if (err) {
      return res.status(500).json({ message: "File upload failed" });
    }

    // Handle the uploaded file
    const file: UploadedFile | undefined = files.file?.[0];
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newFilePath: string = path.join(form.uploadDir, file.originalFilename || "uploaded.mp4");

    try {
      // Move file from temp location to final destination
      fs.renameSync(file.filepath, newFilePath);
      res.status(200).json({ message: "Movie uploaded successfully!", filename: file.originalFilename });
    } catch (renameErr) {
      return res.status(500).json({ message: "Error saving file" });
    }
  });
};

export default uploadHandler;
