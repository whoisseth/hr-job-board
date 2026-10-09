import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs/promises";
import path from "path";

// Initialize S3 client if bucket is configured
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";
const REGION = process.env.AWS_REGION || "ap-south-1";

let s3Client: S3Client | null = null;
if (BUCKET_NAME && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

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
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileName = `${candidateId}-${timestamp}-${sanitizedName}`;
  const key = `resumes/${fileName}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // If S3 bucket is configured, attempt upload to S3
  if (s3Client && BUCKET_NAME.trim() !== "") {
    try {
      if (previousKey && !previousKey.startsWith("/uploads/")) {
        try {
          const deleteCommand = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: previousKey,
          });
          await s3Client.send(deleteCommand);
        } catch (delError) {
          console.error("Error deleting previous resume from S3:", delError);
        }
      }

      const uploadCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: fileType || file.type,
        ContentDisposition: "inline",
      });

      await s3Client.send(uploadCommand);

      const s3Domain = `${BUCKET_NAME}.s3.${REGION}.amazonaws.com`;
      const publicUrl = `https://${s3Domain}/${key}`;

      return {
        url: publicUrl,
        key,
        fileType: fileType || file.type,
        fileSize: file.size,
      };
    } catch (s3Error) {
      console.warn("S3 upload failed, falling back to local file storage:", s3Error);
    }
  }

  // Local storage fallback (saves to public/uploads/resumes/)
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
    await fs.mkdir(uploadDir, { recursive: true });

    if (previousKey) {
      const prevFile = path.basename(previousKey);
      try {
        await fs.unlink(path.join(uploadDir, prevFile));
      } catch {
        // Ignore previous file delete errors
      }
    }

    const localFilePath = path.join(uploadDir, fileName);
    await fs.writeFile(localFilePath, buffer);

    const publicUrl = `/uploads/resumes/${fileName}`;

    return {
      url: publicUrl,
      key: fileName,
      fileType: fileType || file.type,
      fileSize: file.size,
    };
  } catch (localError) {
    console.error("Error saving resume locally:", localError);
    throw new Error("Failed to save resume");
  }
}

