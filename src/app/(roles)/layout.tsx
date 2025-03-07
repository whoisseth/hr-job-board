import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { SidebarLayout } from "./sidebar";

type Props = {};

export default async function RolesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  if (!user.role || !user.userName) {
    return redirect("/user-info");
  }

  return (
    // <div className="flex h-screen w-screen">
    //   <SidebarLayout userRole={user.role} userName={user.userName}>
    //     {children}
    //   </SidebarLayout>
    // </div>

    <>{children}</>
  );
}
