CREATE TABLE `duels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`song_choice` text,
	`chanteur_1_id` integer,
	`chanteur_2_id` integer
);
--> statement-breakpoint
ALTER TABLE `enregistrements` ADD `duel_id` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `enregistrements` ADD `nb_likes` integer DEFAULT 0 NOT NULL;