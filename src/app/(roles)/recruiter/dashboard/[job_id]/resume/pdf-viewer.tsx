"use client";

import React from "react";

interface PDFViewerProps {
  pdfUrl: string;
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  return (
    <iframe
      src={pdfUrl}
      className="mx-auto h-full w-full max-w-[1200px] border-none"
    />
  );
}
