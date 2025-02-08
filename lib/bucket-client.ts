import { Storage } from '@google-cloud/storage';

export class BucketClient {
  private client: Storage;
  private bucketName: string;
  private uploadPath: string;

  constructor(uploadPath: string, isPrivate: boolean = false) {
    if (!process.env.GOOGLE_CLOUD_PROJECT_ID || 
        !process.env.GOOGLE_CLOUD_CLIENT_EMAIL || 
        !process.env.GOOGLE_CLOUD_PRIVATE_KEY || 
        (!isPrivate && !process.env.GOOGLE_CLOUD_PUBLIC_BUCKET) || 
        (isPrivate && !process.env.GOOGLE_CLOUD_PRIVATE_BUCKET)) {
      throw new Error("Missing required Google Cloud environment variables");
    }

    this.client = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n')
      }
    });

    this.bucketName = isPrivate 
      ? process.env.GOOGLE_CLOUD_PRIVATE_BUCKET!
      : process.env.GOOGLE_CLOUD_PUBLIC_BUCKET!;
    
    this.uploadPath = uploadPath;
  }

  async uploadFile(buffer: Buffer, fileName: string): Promise<string> {
    const blob = this.client
      .bucket(this.bucketName)
      .file(`${this.uploadPath}${fileName}`);

    return new Promise((resolve, reject) => {
      const isVideo = fileName.endsWith('.mp4') || fileName.endsWith('.mov') || fileName.endsWith('.avi');
      const blobStream = blob.createWriteStream({
        resumable: isVideo, 
        gzip: !isVideo
      });

      blobStream.on('error', reject);
      blobStream.on('finish', () => {
        blob.setMetadata({ contentType: isVideo ? 'video/mp4' : 'application/octet-stream' })
          .then(() => {
            const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${this.uploadPath}${fileName}`;
            resolve(publicUrl);
          })
          .catch(reject);
      });

      blobStream.end(buffer);
    });
  }

  async deleteFile(fileName: string): Promise<void> {
    const file = this.client.bucket(this.bucketName).file(`${this.uploadPath}${fileName}`);

    try {
      await file.delete();
    } catch (error: unknown) {
      throw new Error(`Failed to delete file (${fileName}): ${error}`);
    }
  }

  async getFile(fileName: string): Promise<Buffer> {
    const file = this.client.bucket(this.bucketName).file(`${this.uploadPath}${fileName}`);

    try {
      const [fileContent] = await file.download();
      return fileContent;
    } catch (error: unknown) {
      throw new Error(`Failed to get file (${fileName}): ${error}`);
    }
  }
}

export const projectClient = new BucketClient('projects/');
export const videoClient = new BucketClient('videos/');