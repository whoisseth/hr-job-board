"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateApplicationStatus } from "../action";
import { useToast } from "@/components/ui/use-toast";

interface StatusDropdownProps {
  currentStatus: "new" | "shortlisted" | "rejected";
  applicationId: number;
  jobId: number;
}

export function StatusDropdown({ currentStatus, applicationId, jobId }: StatusDropdownProps) {
  const [status, setStatus] = React.useState(currentStatus);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const result = await updateApplicationStatus(
        applicationId,
        newStatus as "new" | "shortlisted" | "rejected",
        jobId
      );

      if (result.success) {
        setStatus(newStatus as "new" | "shortlisted" | "rejected");
        toast({
          title: "Status updated",
          description: "Application status has been updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
      disabled={isUpdating}
    >
      <SelectTrigger className="w-[130px]">
        <SelectValue>
          {status === "new" ? "Pending" : status.charAt(0).toUpperCase() + status.slice(1)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="new">Pending</SelectItem>
        <SelectItem value="shortlisted">Shortlisted</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  );
} 