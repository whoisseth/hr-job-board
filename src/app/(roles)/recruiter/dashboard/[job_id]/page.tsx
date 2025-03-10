import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getJobDetails, getApplicants } from "./action";
import { notFound } from "next/navigation";
import { StatusDropdown } from "./components/status-dropdown";

interface JobDetailsPageProps {
  params: Promise<{ job_id: string }>;
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { job_id } = await params;
  const job = await getJobDetails(Number(job_id));
  const { data: applicants = [], error } = await getApplicants(Number(job_id));

  if (!job || "error" in job) {
    notFound();
  }

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
      <div className="flex items-center gap-2">
        <Link href="/recruiter/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
        <Badge variant={job.status === "open" ? "default" : "secondary"}>
          {job.status === "open" ? "Open" : "Closed"}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Created on {new Date(job.createdAt).toLocaleDateString()}
            {job.updatedAt &&
              new Date(job.updatedAt).getTime() !==
                new Date(job.createdAt).getTime() &&
              ` • Updated on ${new Date(job.updatedAt).toLocaleDateString()}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-sm text-muted-foreground">{job.description}</p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Applicants ({applicants.length})
        </h2>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-muted/50 dark:bg-background">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted"
            >
              New
            </TabsTrigger>
            <TabsTrigger
              value="shortlisted"
              className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted"
            >
              Shortlisted
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted"
            >
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Education</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell className="font-medium">
                          {applicant.name}
                        </TableCell>
                        <TableCell>{applicant.email}</TableCell>
                        <TableCell>{applicant.skills.join(", ")}</TableCell>
                        <TableCell>{applicant.experience}</TableCell>
                        <TableCell>{applicant.education.join(", ")}</TableCell>
                        <TableCell>
                          <StatusDropdown
                            currentStatus={applicant.status}
                            applicationId={applicant.id}
                            jobId={Number(job_id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {applicant.resumeUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <Link href={applicant.resumeUrl} target="_blank">
                                  View Resume
                                </Link>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {applicants.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No applicants found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {["new", "shortlisted", "rejected"].map((status) => (
            <TabsContent key={status} value={status}>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Education</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applicants
                        .filter((applicant) => applicant.status === status)
                        .map((applicant) => (
                          <TableRow key={applicant.id}>
                            <TableCell className="font-medium">
                              {applicant.name}
                            </TableCell>
                            <TableCell>{applicant.email}</TableCell>
                            <TableCell>{applicant.skills.join(", ")}</TableCell>
                            <TableCell>{applicant.experience}</TableCell>
                            <TableCell>{applicant.education.join(", ")}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {applicant.resumeUrl && (
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={applicant.resumeUrl} target="_blank">
                                      View Resume
                                    </Link>
                                  </Button>
                                )}
                                <StatusDropdown
                                  currentStatus={applicant.status}
                                  applicationId={applicant.id}
                                  jobId={Number(job_id)}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      {applicants.filter((a) => a.status === status).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No {status} applicants found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
