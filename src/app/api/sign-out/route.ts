import { invalidateSession, validateRequest } from "@/lib/auth";
import { deleteSessionTokenCookie } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function GET() {
  const { session } = await validateRequest();
  if (session) {
    try {
      await invalidateSession(session.id);
    } catch (e) {
      console.error("Error invalidating session:", e);
    }
  }
  await deleteSessionTokenCookie();
  redirect("/");
}

