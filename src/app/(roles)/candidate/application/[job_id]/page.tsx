import { ApplicationForm } from "./application-form";

export default async function JobApplicationPage({
  params,
}: {
  params: Promise<{ job_id: string }>;
}) {
  const { job_id } = await params;

  // Mock job data - in a real app, you would fetch this from an API
  const job = {
    id: job_id,
    title: "Frontend Developer",
    description:
      "We are looking for a skilled Frontend Developer with experience in React, TypeScript, and TailwindCSS.",
    requirements:
      "- 2+ years of experience with React\n- Strong knowledge of TypeScript\n- Experience with TailwindCSS\n- Good understanding of responsive design principles",
    company: "Acme Inc.",
    location: "Remote",
    createdAt: new Date("2023-05-15"),
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Apply for Job</h1>
      <ApplicationForm jobId={job_id} job={job} />
    </div>
  );
}
