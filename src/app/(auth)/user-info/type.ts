import { userRoleEnum } from "@/db/schema";
import { z } from "zod";

export const userInfoSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  role: z.enum(userRoleEnum),
});
