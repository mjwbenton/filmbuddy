CREATE TABLE `rolls` (
	`id` text PRIMARY KEY NOT NULL,
	`film_stock` text NOT NULL,
	`iso` integer NOT NULL,
	`camera` text NOT NULL,
	`loaded_at` integer NOT NULL,
	`finished_at` integer
);
