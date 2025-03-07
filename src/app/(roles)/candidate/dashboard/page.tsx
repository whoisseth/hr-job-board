import Link from "next/link";
import { Briefcase, Eye, FileText, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobListingCard } from "@/components/job-listing-card";
import { getJobs } from "../../recruiter/action";

// Mock data for applications
const applications = [
  {
    id: 1,
    jobId: 1,
    jobTitle: "Frontend Developer",
    status: "pending",
    appliedAt: new Date("2023-06-01"),
  },
  {
    id: 2,
    jobId: 2,
    jobTitle: "Frontend Developer",
    status: "shortlisted",
    appliedAt: new Date("2023-06-25"),
  },
  {
    id: 3,
    jobId: 3,
    jobTitle: "Frontend Developer",
    status: "rejected",
    appliedAt: new Date("2023-05-10"),
  },
];

export default async function CandidateDashboardPage() {
  const { data: jobListings = [], error } = await getJobs();

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-destructive">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

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
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Resume
              </Button>
            </Link>
            <Link href="/candidate/resume">
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View Resume
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {jobListings.map((job) => (
            <div key={job.id} className="flex items-center justify-between">
              <JobListingCard
                job={job}
                isRecruiter={false}
                href={`/candidate/application/${job.id}`}
                hasApplied={applications.some((app) => app.jobId === job.id)}
                showApplyButton={true}
              />
            </div>
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
