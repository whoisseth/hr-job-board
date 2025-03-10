"use server";

import { db } from "@/db";
import { applications, resumes } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type SubmitApplicationInput = {
  jobId: number;
};

export async function submitApplication(data: SubmitApplicationInput) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Check if user has uploaded a resume
    const [latestResume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.candidateId, user.id))
      .orderBy(desc(resumes.createdAt))
      .limit(1);

    if (!latestResume) {
      return {
        success: false,
        error: "Please upload your resume before applying",
      };
    }

    // Check if user has already applied
    const existingApplication = await db
      .select()
      .from(applications)
      .where(
        (applications) =>
          eq(applications.jobId, data.jobId) &&
          eq(applications.candidateId, user.id)
      )
      .limit(1);

    if (existingApplication.length > 0) {
      return {
        success: false,
        error: "You have already applied for this job",
      };
    }

    // Create new application
    const [application] = await db
      .insert(applications)
      .values({
        jobId: data.jobId,
        candidateId: user.id,
        status: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/candidate/dashboard");
    revalidatePath("/candidate/applications");

    return { success: true, data: application };
  } catch (error) {
    console.error("Error submitting application:", error);
    return { success: false, error: "Failed to submit application" };
  }
}
