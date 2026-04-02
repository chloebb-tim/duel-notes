CREATE TABLE `votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`duel_id` integer NOT NULL,
	`enregistrement_id` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `votes_user_id_duel_id_unique` ON `votes` (`user_id`,`duel_id`);