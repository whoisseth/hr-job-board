import { integer, text, sqliteTableCreator } from "drizzle-orm/sqlite-core";

export const accountTypeEnum = ["email", "google", "github"] as const;
export const userRoleEnum = ["candidate", "recruiter"] as const;

const sqliteTable = sqliteTableCreator((name) => `${name}`);

export const users = sqliteTable("user", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  email: text("email").unique(),
  userName: text("userName"),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
  role: text("role", { enum: userRoleEnum }),
  isOnboarded: integer("is_onboarded", { mode: "boolean" }).default(false),
});

export const accounts = sqliteTable("accounts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  accountType: text("account_type", { enum: accountTypeEnum }).notNull(),
  githubId: text("github_id").unique(),
  googleId: text("google_id").unique(),
  password: text("password"),
  salt: text("salt"),
});

export const magicLinks = sqliteTable("magic_links", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  token: text("token"),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
});

export const resetTokens = sqliteTable("reset_tokens", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  token: text("token"),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
});

export const verifyEmailTokens = sqliteTable("verify_email_tokens", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  token: text("token"),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
});

export const profiles = sqliteTable("profile", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  displayName: text("display_name"),
  imageId: text("image_id"),
  image: text("image"),
  bio: text("bio").notNull().default(""),
});

export const sessions = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  expiresAt: integer("expires_at").notNull(),
});

export const jobs = sqliteTable("job", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status", { enum: ["open", "closed"] }).notNull(),
  recruiterId: integer("recruiter_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const applications = sqliteTable("application", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  jobId: integer("job_id", { mode: "number" })
    .references(() => jobs.id, { onDelete: "cascade" })
    .notNull(),
  candidateId: integer("candidate_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  resumeUrl: text("resume_url").notNull(),
  parsedDetails: text("parsed_details").notNull(),
  status: text("status", {
    enum: ["new", "shortlisted", "rejected"],
  }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const resumes = sqliteTable("resume", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  candidateId: integer("candidate_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  fileType: text("file_type").notNull().default("application/pdf"),
  fileSize: integer("file_size", { mode: "number" }).notNull(),
  extractedText: text("extracted_text"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export type User = typeof users.$inferSelect & {
  role: (typeof userRoleEnum)[number] | null;
};
export type Profile = typeof profiles.$inferSelect;
export type Session = typeof sessions.$inferSelect;
