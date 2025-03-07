import { redirect } from "next/navigation";
import { signOutAction } from "@/actions/sign-out";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await signOutAction();
    redirect("/signed-out");
  } catch (error) {
    redirect("/sign-in");
  }
}
