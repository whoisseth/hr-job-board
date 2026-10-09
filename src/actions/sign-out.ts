import { invalidateSession, validateRequest } from "@/lib/auth";
import { deleteSessionTokenCookie } from "@/lib/session";
import { redirect } from "next/navigation";

export async function signOutAction() {
  const { session } = await validateRequest();

  if (session) {
    try {
      await invalidateSession(session.id);
    } catch (e) {
      console.error("Error invalidating session in db:", e);
    }
  }

  await deleteSessionTokenCookie();
  redirect("/");
}

