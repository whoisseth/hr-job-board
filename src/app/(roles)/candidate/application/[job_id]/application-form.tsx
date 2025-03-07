"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ApplicationFormProps {
  jobId: string;
  job: {
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string;
  };
}

export function ApplicationForm({ jobId, job }: ApplicationFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Check if file is a PDF
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file");
      setFile(null);
      return;
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      setFile(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload your resume");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // In a real app, you would upload the file to your server
      // and process it with a resume parsing API

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess(true);

      // Redirect to applications page after successful submission
      setTimeout(() => {
        router.push("/candidate/applications");
      }, 2000);
    } catch (err) {
      setError("Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>
          {job.company} • {job.location}
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

        <Separator />

        {success ? (
          <Alert className="bg-green-50 text-green-800">
            <Upload className="h-4 w-4" />
            <AlertTitle>Application Submitted!</AlertTitle>
            <AlertDescription>
              Your application has been successfully submitted. You will be
              redirected to your applications page.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resume">Upload Resume (PDF only, max 5MB)</Label>
              <div className="flex items-center gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label
                    htmlFor="resume"
                    className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-input bg-muted/50 px-4 py-5 text-center"
                  >
                    <FileUp className="mb-2 h-8 w-8 text-muted-foreground" />
                    <div className="space-y-1 text-sm">
                      <p className="font-medium text-foreground">
                        {file
                          ? file.name
                          : "Drop your resume here or click to browse"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF (max. 5MB)
                      </p>
                    </div>
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </Label>
                </div>
                <Button
                  type="submit"
                  disabled={!file || isUploading}
                  className="min-w-[100px]"
                >
                  {isUploading ? "Uploading..." : "Apply"}
                </Button>
              </div>
              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
