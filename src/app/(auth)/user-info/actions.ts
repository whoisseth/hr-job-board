"use server";

import { z } from "zod";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { userInfoSchema } from "./type";

export const addUserInfo = async (input: z.infer<typeof userInfoSchema>) => {
  // console.log('hello')
  const validatedInput = userInfoSchema.parse(input);
  console.log("validatedInput-", validatedInput);

  const { role, userName } = input;
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Update isOnboarded field
  const updatedUser = await db
    .update(users)
    .set({
      userName: userName,
      role: role,
      isOnboarded: true,
    })
    .where(eq(users.id, user.id))
    .returning();

  return updatedUser;
};
