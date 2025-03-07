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

interface JobDetailsPageProps {
  params: Promise<{ job_id: string }>;
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { job_id } = await params;

  // Mock job data - in a real app, you would fetch this from an API
  const job = {
    job_id,
    title: "Frontend Developer",
    description:
      "We are looking for a skilled Frontend Developer with experience in React, TypeScript, and TailwindCSS.",
    requirements:
      "- 2+ years of experience with React\n- Strong knowledge of TypeScript\n- Experience with TailwindCSS\n- Good understanding of responsive design principles",
    status: "open",
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-15"),
  };

  // Mock applicants data
  const applicants = [
    {
      id: "app_1",
      name: "John Doe",
      email: "john@example.com",
      skills: "React, TypeScript",
      experience: "3 years",
      education: "Bachelor's",
      status: "new",
      appliedAt: new Date("2023-06-01"),
    },
    {
      id: "app_2",
      name: "Jane Smith",
      email: "jane@example.com",
      skills: "React, JavaScript",
      experience: "2 years",
      education: "Master's",
      status: "shortlisted",
      appliedAt: new Date("2023-06-05"),
    },
    {
      id: "app_3",
      name: "Alex Johnson",
      email: "alex@example.com",
      skills: "React, TypeScript, TailwindCSS",
      experience: "4 years",
      education: "Bachelor's",
      status: "rejected",
      appliedAt: new Date("2023-06-10"),
    },
  ];

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
            Created on {job.createdAt.toLocaleDateString()}
            {job.updatedAt &&
              job.updatedAt !== job.createdAt &&
              ` • Updated on ${job.updatedAt.toLocaleDateString()}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-sm text-muted-foreground">{job.description}</p>
          </div>

          <div>
            <h3 className="font-medium">Requirements</h3>
            <p className="whitespace-pre-line text-sm text-muted-foreground">
              {job.requirements}
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Applicants ({applicants.length})
        </h2>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
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
                        <TableCell>{applicant.skills}</TableCell>
                        <TableCell>{applicant.experience}</TableCell>
                        <TableCell>{applicant.education}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              applicant.status === "new"
                                ? "outline"
                                : applicant.status === "shortlisted"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {applicant.status.charAt(0).toUpperCase() +
                              applicant.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              View Resume
                            </Button>
                            <Button variant="outline" size="sm">
                              Change Status
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new" className="mt-4">
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
                      .filter((applicant) => applicant.status === "new")
                      .map((applicant) => (
                        <TableRow key={applicant.id}>
                          <TableCell className="font-medium">
                            {applicant.name}
                          </TableCell>
                          <TableCell>{applicant.email}</TableCell>
                          <TableCell>{applicant.skills}</TableCell>
                          <TableCell>{applicant.experience}</TableCell>
                          <TableCell>{applicant.education}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                View Resume
                              </Button>
                              <Button variant="outline" size="sm">
                                Change Status
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Similar content for shortlisted and rejected tabs */}
        </Tabs>
      </div>
    </div>
  );
}
