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

  const handleProcessFile = (error: any, file: any) => {
    if (!error && file?.serverId) {
      try {
        const response = JSON.parse(file.serverId);
        if (response.url) {
          setResumeUrl(response.url);
          setHasResume(true);
        }
      } catch (e) {
        console.error("Error processing file response:", e);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {hasResume && resumeUrl ? (
          <>
            <Button variant="outline" asChild>
              <Link href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="mr-2 h-4 w-4" />
                View Current Resume
              </Link>
            </Button>
            <div className="mt-2 w-[310px]">
              <FilePond
                acceptedFileTypes={["application/pdf"]}
                server={{
                  process: "/api/resume-parser",
                  fetch: null,
                  revert: null,
                }}
                labelIdle='<svg class="w-5 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>Update Resume'
                credits={false}
                allowMultiple={false}
                onprocessfile={handleProcessFile}
              />
            </div>
          </>
        ) : (
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
              onprocessfile={handleProcessFile}
            />
          </div>
        )}
      </div>
      {hasResume && (
        <div className="text-sm text-muted-foreground">
          Last updated:{" "}
          {new Date(
            initialResume?.createdAt || Date.now()
          ).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
