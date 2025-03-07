"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

interface JobListingCardProps {
  job: {
    id: string
    title: string
    description: string
    status: string
    createdAt: Date
    applicantsCount?: number
  }
  isRecruiter: boolean
  href: string
  hasApplied?: boolean
}

export function JobListingCard({ job, isRecruiter, href, hasApplied = false }: JobListingCardProps) {
  const [status, setStatus] = useState(job.status)

  const handleStatusChange = (checked: boolean) => {
    setStatus(checked ? "open" : "closed")
    // Here you would typically call an API to update the job status
  }

  return (
    <div className="flex flex-col rounded-lg border p-4 shadow-sm">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <Badge variant={status === "open" ? "default" : "secondary"}>{status === "open" ? "Open" : "Closed"}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            <Calendar className="mr-1 inline-block h-3 w-3" />
            Posted on {job.createdAt.toLocaleDateString()}
          </p>
          <p className="mt-2 text-sm">{job.description}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {isRecruiter ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{status === "open" ? "Open" : "Closed"}</span>
                <Switch
                  checked={status === "open"}
                  onCheckedChange={handleStatusChange}
                  aria-label="Toggle job status"
                />
              </div>
              {job.applicantsCount !== undefined && (
                <span className="text-sm text-muted-foreground">
                  {job.applicantsCount} applicant{job.applicantsCount !== 1 ? "s" : ""}
                </span>
              )}
              <Link href={href}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </>
          ) : (
            <Link href={href}>
              <Button variant={hasApplied ? "secondary" : "default"} size="sm" disabled={hasApplied}>
                {hasApplied ? "Applied" : "Apply"}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

