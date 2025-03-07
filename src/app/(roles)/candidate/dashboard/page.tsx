import Link from "next/link";
import { Briefcase, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobListingCard } from "@/components/job-listing-card";

// Mock data for job listings
const jobListings = [
  {
    id: "job_1",
    title: "Frontend Developer",
    description:
      "We are looking for a skilled Frontend Developer with experience in React, TypeScript, and TailwindCSS.",
    status: "open",
    createdAt: new Date("2023-05-15"),
  },
  {
    id: "job_2",
    title: "Frontend Developer",
    description:
      "We are looking for a skilled Frontend Developer with experience in React, TypeScript, and TailwindCSS.",
    status: "open",
    createdAt: new Date("2023-06-20"),
  },
  {
    id: "job_3",
    title: "Frontend Developer",
    description:
      "We are looking for a skilled Frontend Developer with experience in React, TypeScript, and TailwindCSS.",
    status: "open",
    createdAt: new Date("2023-04-10"),
  },
];

// Mock data for applications
const applications = [
  {
    id: "app_1",
    jobId: "job_1",
    jobTitle: "Frontend Developer",
    status: "pending",
    appliedAt: new Date("2023-06-01"),
  },
  {
    id: "app_2",
    jobId: "job_2",
    jobTitle: "Frontend Developer",
    status: "shortlisted",
    appliedAt: new Date("2023-06-25"),
  },
  {
    id: "app_3",
    jobId: "job_3",
    jobTitle: "Frontend Developer",
    status: "rejected",
    appliedAt: new Date("2023-05-10"),
  },
];

export default function CandidateDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Candidate Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Jobs
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobListings.length}</div>
            <p className="text-xs text-muted-foreground">
              Jobs matching your profile
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">
              {
                applications.filter((app) => app.status === "shortlisted")
                  .length
              }{" "}
              shortlisted
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Job Listings</h2>
          <div className="flex items-center gap-4">
            <Link href="/candidate/resume">
              <Button variant="outline">View Resume</Button>
            </Link>
            <Link href="/candidate/jobs">
              <Button variant="link" className="h-auto p-0">
                View All Jobs
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {jobListings.map((job) => (
            <JobListingCard
              key={job.id}
              job={job}
              isRecruiter={false}
              href={`/candidate/application/${job.id}`}
              // Check if user has already applied to this job
              hasApplied={applications.some((app) => app.jobId === job.id)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Applications</h2>
          <Link href="/candidate/applications">
            <Button variant="link" className="h-auto p-0">
              View All
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="flex flex-col rounded-lg border p-4 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold">
                    {application.jobTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Applied on {application.appliedAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      application.status === "pending"
                        ? "bg-blue-100 text-blue-800"
                        : application.status === "shortlisted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {application.status.charAt(0).toUpperCase() +
                      application.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
