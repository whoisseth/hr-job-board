"use client";

import { useState, useTransition } from "react";
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
import { createApplication } from "@/app/(roles)/candidate/dashboard/action";
import { User } from "@/db/schema";
import { LoaderButton } from "./loader-button";
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
  href?: string;
  hasApplied?: boolean;
  showApplyButton?: boolean;
  onApply?: () => void;
  user?: User;
}

export function JobListingCard({
  job,
  user,
  isRecruiter,
  href,
  hasApplied = false,
  showApplyButton = false,
  onApply,
}: JobListingCardProps) {
  const [status, setStatus] = useState(job.status);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleStatusChange = async (checked: boolean) => {
    startTransition(async () => {
      try {
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
      }
    });
  };

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const result = await deleteJob(job.id);

        if (result.success) {
          toast.success("Job deleted successfully");
          router.refresh();
        } else {
          toast.error(result.error || "Failed to delete job");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  function handleApply() {
    if (!user) {
      toast.error("Please login to apply for this job");
      return;
    }
    startTransition(async () => {
      try {
        const result = await createApplication({
          jobId: job.id,
          candidateId: user.id,
        });
        
        if (result.success) {
          toast.success("Applied successfully");
          router.refresh();
        } else {
          toast.error(result.error || "Failed to apply");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  }

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
            {href && (
              <Link href={href}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            )}
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
                    This action cannot be undone. This will permanently delete
                    the job listing and all associated applications.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isPending}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      {hasApplied && (
        <div className="flex items-center gap-2">
          <Badge className="bg-green-300" variant="default">
            Applied
          </Badge>
        </div>
      )}

      {showApplyButton && !hasApplied && (
        <LoaderButton
          variant="default"
          className="mt-2"
          onClick={handleApply}
          isLoading={isPending}
        >
          Apply
        </LoaderButton>
      )}
    </div>
  );
}
