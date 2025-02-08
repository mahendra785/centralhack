import { Storage } from '@google-cloud/storage';

export class BucketClient {
  private client: Storage;
  private bucketName: string;
  private uploadPath: string;

  constructor(uploadPath: string, isPrivate: boolean = false) {
    this.client = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n')
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

      console.log(this.bucketName);

    return new Promise((resolve, reject) => {
      const blobStream = blob.createWriteStream({
        resumable: false,
        gzip: true
      });

      blobStream.on('error', (err) => reject(err));
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${this.uploadPath}${fileName}`;
        resolve(publicUrl);
      });

      blobStream.end(buffer);
    });
  }

  async deleteFile(fileName: string): Promise<void> {
    const file = this.client
      .bucket(this.bucketName)
      .file(`${this.uploadPath}${fileName}`);

    try {
      await file.delete();
    } catch (error) {
      throw new Error(`Failed to delete file: ${error}`);
    }
  }

  async getFile(fileName: string): Promise<Buffer> {
    const file = this.client
      .bucket(this.bucketName)
      .file(`${this.uploadPath}${fileName}`);

    try {
      const [fileContent] = await file.download();
      return fileContent;
    } catch (error) {
      throw new Error(`Failed to get file: ${error}`);
    }
  }
}

export const projectClient = new BucketClient('projects/');