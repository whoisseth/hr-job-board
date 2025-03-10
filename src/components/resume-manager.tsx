"use client";

import { useState, useEffect } from "react";
import { FilePond } from "react-filepond";
import { Eye, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import "filepond/dist/filepond.min.css";
import Link from "next/link";

interface ResumeData {
  url: string;
  createdAt: Date;
}

export function ResumeManager({
  initialResume,
}: {
  initialResume?: ResumeData;
}) {
  const [hasResume, setHasResume] = useState(!!initialResume);
  const [resumeUrl, setResumeUrl] = useState(initialResume?.url);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDate, setUploadedDate] = useState<Date>(
    initialResume?.createdAt || new Date()
  );

  useEffect(() => {
    // Add FilePond styling
    const style = document.createElement("style");
    style.textContent = `
      .filepond--credits { display: none !important; }
      .filepond--root {
        font-family: inherit;
        font-size: 14px;
      }
      .filepond--drop-label {
        min-height: 2.5em !important;
        margin-top: 1.2rem - 25px;
        background: #2563eb;
        color: white;
        border-radius: 0.5rem;
        cursor: pointer;
        padding: 0.5rem 1rem;
        transition: background-color 0.2s;
      }
      .filepond--drop-label:hover {
        background: #1d4ed8;
      }
      .filepond--panel-root {
        background-color: transparent !important;
        border: none !important;
      }
      .filepond--label-action {
        text-decoration: none;
        color: inherit;
      }
      .filepond--panel-root {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Add new function to handle upload start
  const handleAddFile = () => {
    setIsUploading(true);
  };

  const handleProcessFile = (error: any, file: any) => {
    if (!error && file?.serverId) {
      try {
        const response = JSON.parse(file.serverId);
        console.log("File upload response:", response);

        if (response.url) {
          // Update all state in one go to ensure UI updates properly
          setResumeUrl(response.url);
          setHasResume(true);
          setUploadedDate(new Date());

          // Clear the FilePond instance after successful upload
          const pond = file.pond;
          if (pond) {
            pond.removeFiles();
          }
        }
      } catch (e) {
        console.error("Error processing file response:", e);
        setHasResume(false);
        setResumeUrl(undefined);
      }
    } else if (error) {
      console.error("Upload error:", error);
      setHasResume(false);
      setResumeUrl(undefined);
    }

    // Always set uploading to false when done
    setIsUploading(false);
  };

  // Debug log for render
  console.log("Current state:", { hasResume, resumeUrl, isUploading });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Show loading state during upload */}
        {isUploading ? (
          <Button variant="outline" disabled className="min-w-[200px]">
            <svg
              className="-ml-1 mr-3 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Uploading Resume...
          </Button>
        ) : hasResume && resumeUrl ? (
          <Button variant="outline" asChild className="min-w-[200px]">
            <Link href={resumeUrl} target="_blank" rel="noopener noreferrer">
              <Eye className="mr-2 h-4 w-4" />
              View Current Resume
            </Link>
          </Button>
        ) : null}
        <div className="mt-2 w-[310px]">
          <FilePond
            acceptedFileTypes={["application/pdf"]}
            server={{
              process: "/api/resume-parser",
              fetch: null,
              revert: null,
            }}
            labelIdle='<svg class="w-5 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>Upload Resume'
            credits={false}
            allowMultiple={false}
            onaddfile={handleAddFile}
            onprocessfile={handleProcessFile}
            beforeRemoveFile={() => false}
            instantUpload={true}
            allowRevert={false}
            maxFiles={1}
            onremovefile={() => true}
          />
        </div>
      </div>
      {hasResume && !isUploading && (
        <div className="text-sm text-muted-foreground">
          Last updated: {uploadedDate.toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
