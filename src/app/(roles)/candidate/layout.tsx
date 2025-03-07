import { getCurrentUser, User } from "@/lib/session";
import { isCandidate } from "@/lib/utils";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default async function CandidateLayout({ children }: Props) {
  const user = await getCurrentUser();

  if (!isCandidate(user)) {
    redirect("/");
  }
  return <>{children}</>;
}
