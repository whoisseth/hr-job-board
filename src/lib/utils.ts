import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { User } from "./session";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isCandidate(user: User) {
  if (!user) {
    return false;
  }
  if (!user.role) {
    return false;
  }
  if (user.role === "candidate") {
    return true;
  }
  return false;
}

export function isRecruiter(user: User) {
  if (!user) {
    return false;
  }
  if (!user.role) {
    return false;
  }
  if (user.role === "recruiter") {
    return true;
  }
  return false;
}

// currentRole fuction

export function currentRole(user: User) {
  if (!user) {
    return null;
  }

  if (isCandidate(user)) {
    return "candidate";
  }

  if (isRecruiter(user)) {
    return "recruiter";
  }

  return null;
}
