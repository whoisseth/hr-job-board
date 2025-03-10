"use server";

import { getCurrentUser } from "@/lib/session";
import { db } from "@/db";
import { jobs, applications, users, resumes } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { deserializeStructuredData } from "@/db/schema";
import { revalidatePath } from "next/cache";

interface ApplicantDetails {
  id: number;
  name: string;
  email: string;
  skills: string[];
  experience: string;
  education: string[];
  status: "new" | "shortlisted" | "rejected";
  resumeUrl: string | null;
}

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

export async function updateApplicationStatus(
  applicationId: number,
  status: "new" | "shortlisted" | "rejected",
  jobId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Update the application status
    await db
      .update(applications)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(applications.id, applicationId));

    // Revalidate the page to show updated data
    revalidatePath(`/recruiter/dashboard/${jobId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating application status:", error);
    return { success: false, error: "Failed to update application status" };
  }
}

export async function getApplicants(jobId: number): Promise<{ 
  success: boolean; 
  data?: ApplicantDetails[];
  error?: string;
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // First, get all applications for this job
    const jobApplications = await db
      .select({
        applicationId: applications.id,
        candidateId: applications.candidateId,
        status: applications.status,
      })
      .from(applications)
      .where(eq(applications.jobId, jobId));

    if (!jobApplications.length) {
      return { success: true, data: [] };
    }

    // Get all candidate IDs
    const candidateIds = jobApplications.map(app => app.candidateId);

    // Get user details for all candidates
    const candidateDetails = await db
      .select({
        id: users.id,
        name: users.userName,
        email: users.email,
      })
      .from(users)
      .where(
        and(
          eq(users.role, "candidate"),
          inArray(users.id, candidateIds)
        )
      );

    // Get latest resume for each candidate
    const candidateResumes = await Promise.all(
      candidateIds.map(async (candidateId) => {
        const [latestResume] = await db
          .select()
          .from(resumes)
          .where(eq(resumes.candidateId, candidateId))
          .orderBy(resumes.createdAt)
          .limit(1);
        return latestResume;
      })
    );

    // Combine all the data
    const applicants: ApplicantDetails[] = jobApplications.map((application) => {
      const candidate = candidateDetails.find(c => c.id === application.candidateId);
      const resume = candidateResumes.find(r => r?.candidateId === application.candidateId);
      
      let skills: string[] = [];
      let education: string[] = [];
      let experience = "0 years"; // Default value

      if (resume) {
        const structuredData = deserializeStructuredData({
          skills: resume.skills,
          experience: resume.experience,
          projects: resume.projects,
          education: resume.education,
        });
        
        skills = structuredData.skills;
        education = structuredData.education;
        
        // Get years of experience from the experience object
        const years = Object.keys(structuredData.experience).length;
        experience = `${years} year${years === 1 ? '' : 's'}`;
      }

      return {
        id: application.applicationId,
        name: candidate?.name || "Unknown",
        email: candidate?.email || "unknown@example.com",
        skills,
        experience,
        education,
        status: application.status,
        resumeUrl: resume?.url || null,
      };
    });

    return {
      success: true,
      data: applicants,
    };

  } catch (error) {
    console.error("Error fetching applicants:", error);
    return {
      success: false,
      error: "Failed to fetch applicants",
    };
  }
}


