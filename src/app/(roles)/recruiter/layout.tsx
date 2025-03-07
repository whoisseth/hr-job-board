import { getCurrentUser, User } from "@/lib/session";
import { isRecruiter } from "@/lib/utils";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default async function RecruiterLayout({ children }: Props) {
  const user = await getCurrentUser();

  if (!isRecruiter(user)) {
    redirect("/");
  }

  return <>{children}</>;
}
