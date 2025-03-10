import Link from "next/link";
import { Briefcase, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobListingCard } from "@/components/job-listing-card";
import { getJobs } from "../../recruiter/action";
import { ResumeManager } from "@/components/resume-manager";
import { db } from "@/db";
import { resumes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/session";
import { getJobApplicationStatus, getUserApplications } from "./action";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function CandidateDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    return <div>Not found</div>;
  }

  const { data: jobListings = [], error } = await getJobs();
  const { data: applications = [] } = await getUserApplications();
  const { data: jobApplicationStatus } = await getJobApplicationStatus();

  // Get the user's latest resume
  const [latestResume] = await db
    .select()
    .from(resumes)
    .where(eq(resumes.candidateId, user.id))
    .orderBy(resumes.createdAt)
    .limit(1);

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Candidate Dashboard
        </h1>
        <ResumeManager
          initialResume={
            latestResume
              ? {
                  url: latestResume.url,
                  createdAt: new Date(latestResume.createdAt),
                }
              : undefined
          }
        />
      </div>

      {/* Overview Section - Always Visible */}
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

      {/* Tabs Section */}
      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList className="">
          <TabsTrigger value="jobs">Available Jobs</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <div className="space-y-4">
            {jobListings.map((job) => (
              <div key={job.id} className="flex items-center justify-between">
                <JobListingCard
                  user={user}
                  job={job}
                  isRecruiter={false}
                  href={`/candidate/application/${job.id}`}
                  hasApplied={applications.some((app) => app.jobId === job.id)}
                  showApplyButton={true}
                />
              </div>
            ))}
            {jobListings.length === 0 && (
              <div className="text-center text-muted-foreground">
                No jobs available at the moment
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <div className="space-y-4">
            {jobApplicationStatus?.applications?.map((application) => (
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
                      Applied on{" "}
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        application.status === "new"
                          ? "bg-blue-100 text-blue-800"
                          : application.status === "shortlisted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {application.status === "new"
                        ? "Pending"
                        : application.status.charAt(0).toUpperCase() +
                          application.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {(!jobApplicationStatus?.applications ||
              jobApplicationStatus.applications.length === 0) && (
              <div className="text-center text-muted-foreground">
                No applications found
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
