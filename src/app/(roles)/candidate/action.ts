"use server";

import { db } from "@/db";
import { applications } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type SubmitApplicationInput = {
  jobId: number;
  resumeUrl: string;
  parsedDetails: string;
};

export async function submitApplication(data: SubmitApplicationInput) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
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
        resumeUrl: data.resumeUrl,
        parsedDetails: data.parsedDetails,
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
