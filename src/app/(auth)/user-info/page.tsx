import { cn } from "@/lib/utils";
import UserInfo from "./components/user-info";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function UserInfoPage() {
  const user = await getCurrentUser();
  console.log("user-", user);

  if (!user) redirect("/sign-in");
  if (user && user.isOnboarded) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-[400px] space-y-6 py-24">
      <h1 className={cn("text-center text-3xl font-bold")}>User Info</h1>
      <UserInfo />
    </div>
  );
}
