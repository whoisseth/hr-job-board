"use client";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .filepond--credits { display: none !important; }
      .filepond--root {
        font-family: inherit;
        font-size: 14px;
      }
      .filepond--drop-label {
        min-height: 2.5em !important;
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
      /* Hide the default border and background */
      .filepond--panel-root {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-80">
        <FilePond
          acceptedFileTypes={["application/pdf"]}
          server={{
            process: "/api/resume-parser",
            fetch: null,
            revert: null,
          }}
          labelIdle='<svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>Upload Resume'
          credits={false}
          className="h-full "
          styleButtonRemoveItemPosition="right"
          allowMultiple={false}
        />
      </div>
    </main>
  );
}
