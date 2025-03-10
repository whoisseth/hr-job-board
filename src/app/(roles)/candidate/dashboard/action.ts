"use server";

import { db } from "@/db";
import { applications, jobs, resumes } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type Application = typeof applications.$inferSelect;
type Job = typeof jobs.$inferSelect;

type ApplicationWithJob = Application & {
  job: Job;
};

export async function createApplication({
  jobId,
  candidateId,
}: {
  jobId: number;
  candidateId: number;
}) {
  try {
    // Check if user has uploaded a resume
    const [latestResume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.candidateId, candidateId))
      .orderBy(desc(resumes.createdAt))
      .limit(1);

    if (!latestResume) {
      return {
        success: false,
        error: "Please upload your resume before applying",
      };
    }

    // Check if application already exists
    const existingApplication = await db.query.applications.findFirst({
      where: and(
        eq(applications.jobId, jobId),
        eq(applications.candidateId, candidateId)
      ),
    });

    if (existingApplication) {
      return {
        success: false,
        error: "You have already applied for this job",
      };
    }

    // Create new application
    const [newApplication] = await db
      .insert(applications)
      .values({
        jobId,
        candidateId,
        status: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/candidate/dashboard");

    return {
      success: true,
      data: newApplication,
    };
  } catch (error) {
    console.error("Error creating application:", error);
    return {
      success: false,
      error: "Failed to create application",
    };
  }
}

export async function getUserApplications() {
  // export async function getUserApplications(candidateId: number) {
  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const userApplications = await db
    .select()
    .from(applications)
    .where(eq(applications.candidateId, user.id));

  return {
    success: true,
    data: userApplications,
  };
}

export async function getJobApplicationStatus() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const userApplications = await db
      .select()
      .from(applications)
      .where(eq(applications.candidateId, user.id))
      .innerJoin(jobs, eq(applications.jobId, jobs.id));

    if (!userApplications.length) {
      return {
        success: true,
        data: {
          hasApplied: false,
          applications: [],
        },
      };
    }

    // Transform the data to match the UI requirements
    const applicationsWithDetails = userApplications.map((application) => ({
      id: application.application.id,
      jobTitle: application.job.title,
      status: application.application.status.toLowerCase(), // Ensure status is lowercase for UI comparison
      appliedAt: application.application.createdAt,
      jobDescription: application.job.description,
      jobStatus: application.job.status,
    }));

    return {
      success: true,
      data: {
        hasApplied: true,
        applications: applicationsWithDetails,
      },
    };
  } catch (error) {
    console.error("Error fetching job application status:", error);
    return {
      success: false,
      error: "Failed to fetch application status",
    };
  }
}
