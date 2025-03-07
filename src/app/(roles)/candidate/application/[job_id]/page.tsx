import { notFound } from "next/navigation";
import { ApplicationForm } from "./application-form";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function JobApplicationPage({
  params,
}: {
  params: Promise<{ job_id: string }>;
}) {
  const { job_id } = await params;

  if (isNaN(Number(job_id))) {
    notFound();
  }

  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, Number(job_id)),
  });

  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Apply for Job</h1>
      <ApplicationForm
        jobId={job_id}
        job={{
          title: job.title,
          description: job.description,
          requirements: "", // Add empty requirements since it's not in the DB schema
          company: "Acme Inc.", // Mock company name for now
          location: "Remote", // Mock location for now
        }}
      />
    </div>
  );
}
