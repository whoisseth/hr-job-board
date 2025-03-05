import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getCurrentUser();
  console.log("user", user);
  if (user && user.isOnboarded) redirect("/dashboard");
  if (user && !user.isOnboarded) redirect("/user-info");
  redirect("/sign-in");
}
