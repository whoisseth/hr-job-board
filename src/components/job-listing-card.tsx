"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { EditJobDialog } from "@/components/edit-job-dialog";
import { updateJob } from "@/app/(roles)/recruiter/action";
import { deleteJob } from "@/app/(roles)/recruiter/dashboard/[job_id]/action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface JobListingCardProps {
  job: {
    id: number;
    title: string;
    description: string;
    status: "open" | "closed";
    createdAt: Date;
    updatedAt: Date | null;
  };
  isRecruiter: boolean;
  href: string;
  hasApplied?: boolean;
  showApplyButton?: boolean;
}

export function JobListingCard({
  job,
  isRecruiter,
  href,
  hasApplied = false,
  showApplyButton = false,
}: JobListingCardProps) {
  const [status, setStatus] = useState(job.status);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (checked: boolean) => {
    try {
      setIsPending(true);
      const newStatus = checked ? "open" : "closed";

      const result = await updateJob({
        id: job.id,
        title: job.title,
        description: job.description,
        status: newStatus,
      });

      if (result.success) {
        setStatus(newStatus);
        toast.success(
          `Job ${newStatus === "open" ? "opened" : "closed"} successfully`
        );
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update job status");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsPending(true);
      const result = await deleteJob(job.id);

      if (result.success) {
        toast.success("Job deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete job");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex w-full justify-between rounded-lg border p-4 shadow-sm">
      <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <Badge variant={status === "open" ? "default" : "secondary"}>
              {status === "open" ? "Open" : "Closed"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            <Calendar className="mr-1 inline-block h-3 w-3" />
            Posted on {job.createdAt.toLocaleDateString()}
          </p>
          <p className="mt-2 text-sm">{job.description}</p>
        </div>

        {isRecruiter && (
          <div className="flex items-center gap-2">
            <Switch
              checked={status === "open"}
              onCheckedChange={handleStatusChange}
              disabled={isPending}
              aria-label="Toggle job status"
            />
            <EditJobDialog job={job} />
            <Link href={href}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isPending}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the job listing
                    and all associated applications.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {showApplyButton && (
        <Link href={href}>
          <Button variant="default" className="mt-2">
            Apply
          </Button>
        </Link>
      )}
    </div>
  );
}
