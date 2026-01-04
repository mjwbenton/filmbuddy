ALTER TABLE `lenses` ADD `aperture_mode` text DEFAULT 'standard' NOT NULL;--> statement-breakpoint
ALTER TABLE `lenses` ADD `max_aperture` real DEFAULT 2.8 NOT NULL;--> statement-breakpoint
ALTER TABLE `lenses` ADD `min_aperture` real DEFAULT 16 NOT NULL;--> statement-breakpoint
ALTER TABLE `lenses` ADD `stop_increment` text DEFAULT 'whole' NOT NULL;--> statement-breakpoint
ALTER TABLE `lenses` ADD `custom_apertures` text;