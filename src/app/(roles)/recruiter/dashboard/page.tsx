import { Briefcase, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobListingCard } from "@/components/job-listing-card";
import { CreateJobDialog } from "@/components/create-job-dialog";
import { getJobs } from "../action";

export default async function RecruiterDashboardPage() {
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
      </div>

      <div className="grid gap-4">
        {jobListings.map((job) => (
          <JobListingCard
            key={job.id}
            job={job}
            isRecruiter={true}
            href={`/recruiter/dashboard/${job.id}`}
          />
        ))}
      </div>
    </div>
  );
}
