"use server";

import { getCurrentUser } from "@/lib/session";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { eq } from "drizzle-orm";

// get job details
export async function getJobDetails(jobId: number) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, jobId),
  });

  if (!job) {
    return { success: false, error: "Job not found" };
  }

  return job;
}

export async function deleteJob(jobId: number) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    await db.delete(jobs).where(eq(jobs.id, jobId));
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete job" };
  }
}
