CREATE TABLE `cameras` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cameras_name_unique` ON `cameras` (`name`);--> statement-breakpoint
CREATE TABLE `film_stocks` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `film_stocks_name_unique` ON `film_stocks` (`name`);--> statement-breakpoint
CREATE TABLE `lenses` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lenses_name_unique` ON `lenses` (`name`);