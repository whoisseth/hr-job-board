CREATE TABLE `application` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job_id` integer NOT NULL,
	`candidate_id` integer NOT NULL,
	`resume_url` text NOT NULL,
	`parsed_details` text NOT NULL,
	`status` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`job_id`) REFERENCES `job`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`candidate_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `job` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`requirements` text NOT NULL,
	`status` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `resume` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`candidate_id` integer NOT NULL,
	`url` text NOT NULL,
	`file_type` text DEFAULT 'application/pdf' NOT NULL,
	`file_size` integer NOT NULL,
	`extracted_text` text,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`candidate_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `applications`;--> statement-breakpoint
DROP TABLE `jobs`;--> statement-breakpoint
DROP TABLE `resumes`;