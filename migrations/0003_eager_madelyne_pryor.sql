CREATE TABLE `applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`candidate_id` integer NOT NULL,
	`job_id` integer NOT NULL,
	`resume_id` integer NOT NULL,
	`resume_url` text NOT NULL,
	`parsed_fields` text NOT NULL,
	`status` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`candidate_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`status` text NOT NULL,
	`recruiter_id` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`recruiter_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `resumes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`candidate_id` integer NOT NULL,
	`url` text NOT NULL,
	`file_type` text DEFAULT 'application/pdf' NOT NULL,
	`file_size` integer NOT NULL,
	`extracted_text` text DEFAULT '',
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`candidate_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
