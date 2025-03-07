import Link from "next/link";
import { Briefcase, Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobListingCard } from "@/components/job-listing-card";
import { CreateJobDialog } from "@/components/create-job-dialog";

// Mock data for job listings
const jobListings = [
  {
    id: "1",
    title: "Frontend Developer",
    description:
      "We are looking for a skilled Frontend Developer with experience in React, TypeScript, and TailwindCSS.",
    status: "open",
    applicantsCount: 12,
    createdAt: new Date("2023-05-15"),
  },
  {
    id: "2",
    title: "Frontend Developer",
    description:
      "We are looking for a skilled Frontend Developer with experience in React, TypeScript, and TailwindCSS.",
    status: "open",
    applicantsCount: 5,
    createdAt: new Date("2023-06-20"),
  },
  {
    id: "3",
    title: "Frontend Developer",
    description:
      "We are looking for a skilled Frontend Developer with experience in React, TypeScript, and TailwindCSS.",
    status: "closed",
    applicantsCount: 8,
    createdAt: new Date("2023-04-10"),
  },
];

export default function RecruiterDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Recruiter Dashboard
        </h1>
        <CreateJobDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </Button>
        </CreateJobDialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobListings.length}</div>
            <p className="text-xs text-muted-foreground">
              {jobListings.filter((job) => job.status === "open").length} active
              jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applicants
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobListings.reduce((acc, job) => acc + job.applicantsCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all job listings
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Job Listings</h2>
          <Link href="/recruiter/jobs">
            <Button variant="link" className="h-auto p-0">
              View All
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {jobListings.map((job) => (
            <JobListingCard
              key={job.id}
              job={job}
              isRecruiter={true}
              href={`/recruiter/dashboard/job_${job.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
