import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user && !user.isOnboarded) redirect("/user-info");

  return (
    <div>
      <h1>Dashboard</h1>

      <p>put your dashboardy stuff here</p>
    </div>
  );
}
