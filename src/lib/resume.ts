import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";
const S3_DOMAIN = `${BUCKET_NAME}.s3.${process.env.AWS_REGION || "ap-south-1"}.amazonaws.com`;

interface UploadResumeParams {
  file: File;
  candidateId: number;
  fileType?: string;
  previousKey?: string;
}

export interface ResumeUploadResult {
  url: string;
  key: string;
  fileType: string;
  fileSize: number;
}

export async function uploadResume({
  file,
  candidateId,
  fileType,
  previousKey,
}: UploadResumeParams): Promise<ResumeUploadResult> {
  try {
    // Delete previous resume if it exists
    if (previousKey) {
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: previousKey,
        });
        await s3Client.send(deleteCommand);
      } catch (error) {
        console.error("Error deleting previous resume:", error);
        // Continue with upload even if deletion fails
      }
    }

    // Generate a unique file name
    const timestamp = Date.now();
    const fileName = `${candidateId}-${timestamp}-${file.name}`;
    const key = `resumes/${fileName}`;

    // Upload file to S3
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: fileType || file.type,
      ContentDisposition: "inline", // This ensures the PDF opens in the browser
    });

    await s3Client.send(uploadCommand);

    // Generate a permanent public URL
    const publicUrl = `https://${S3_DOMAIN}/${key}`;

    return {
      url: publicUrl,
      key,
      fileType: fileType || file.type,
      fileSize: file.size,
    };
  } catch (error) {
    console.error("Error uploading resume:", error);
    throw new Error("Failed to upload resume");
  }
}
