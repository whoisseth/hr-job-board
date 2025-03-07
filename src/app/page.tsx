import { getCurrentUser } from "@/lib/session";
import { currentRole } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getCurrentUser();
  console.log("user", user);
  // if (user && user.isOnboarded) redirect("/dashboard");
  // if (user && !user.isOnboarded) redirect("/user-info");
  if (currentRole(user)) {
    redirect(`/${currentRole(user)}/dashboard`);
  }
  redirect("/sign-in");
}
