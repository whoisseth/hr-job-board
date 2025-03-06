import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

type Props = {};

export default async function RolesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/login");
  }
  if (user && !user.role) {
    return redirect("/user-info");
  }

  return <>{children}</>;
}
