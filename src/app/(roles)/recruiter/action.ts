"use server";

import { db } from "@/db";
import { jobs } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";

export type CreateJobInput = {
  title: string;
  description: string;
  status: "open" | "closed";
};

export type UpdateJobInput = CreateJobInput & {
  id: number;
};

export async function createJob(data: CreateJobInput) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [job] = await db
      .insert(jobs)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/");
    return { success: true, data: job };
  } catch (error) {
    console.error("Error creating job:", error);
    return { success: false, error: "Failed to create job" };
  }
}

export async function updateJob(data: UpdateJobInput) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [job] = await db
      .update(jobs)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, data.id))
      .returning();

    revalidatePath("/");
    return { success: true, data: job };
  } catch (error) {
    console.error("Error updating job:", error);
    return { success: false, error: "Failed to update job" };
  }
}

export async function getJobs() {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const allJobs = await db
      .select()
      .from(jobs)
      .orderBy(desc(jobs.createdAt));

    return { success: true, data: allJobs };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { success: false, error: "Failed to fetch jobs" };
  }
}

// get all
