import { db } from "@/db";
import { resumes } from "@/db/schema";
import { ResumeStructuredData } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { eq } from "drizzle-orm";
import { uploadResume } from "@/lib/resume";

export const maxDuration = 60;

export async function addResumeData({
  candidateId,
  file,
  fileType,
  extractedText,
  structuredData,
}: {
  candidateId: number;
  file: File;
  fileType: string;
  extractedText?: string;
  structuredData?: ResumeStructuredData;
}) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    // Check if resume already exists for this user
    const existingResume = await db
      .select()
      .from(resumes)
      .where(eq(resumes.candidateId, candidateId))
      .limit(1);

    // Extract the key from the URL if there's an existing resume
    const previousKey = existingResume[0]?.url
      ? existingResume[0].url.split(
          `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`
        )[1]
      : undefined;

    // Upload new resume
    const uploadResult = await uploadResume({
      file,
      candidateId,
      fileType,
      previousKey,
    });

    const serializedData = structuredData
      ? {
          skills: JSON.stringify(structuredData.skills),
          experience: JSON.stringify(structuredData.experience),
          projects: JSON.stringify(structuredData.projects),
          education: JSON.stringify(structuredData.education),
        }
      : {
          skills: "[]",
          experience: "{}",
          projects: "{}",
          education: "[]",
        };

    let resume;
    if (existingResume.length > 0) {
      // Update existing resume
      [resume] = await db
        .update(resumes)
        .set({
          url: uploadResult.url,
          fileType: uploadResult.fileType,
          fileSize: uploadResult.fileSize,
          extractedText,
          ...serializedData,
          updatedAt: new Date(),
        })
        .where(eq(resumes.candidateId, candidateId))
        .returning();
    } else {
      // Create new resume
      [resume] = await db
        .insert(resumes)
        .values({
          candidateId,
          url: uploadResult.url,
          fileType: uploadResult.fileType,
          fileSize: uploadResult.fileSize,
          extractedText,
          ...serializedData,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
    }

    return { success: true, data: resume };
  } catch (error) {
    console.error("Error managing resume data:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to manage resume data",
    };
  }
}
