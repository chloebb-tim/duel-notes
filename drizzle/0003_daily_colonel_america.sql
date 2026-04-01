PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_duels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`song_choice` text,
	`chanteur_1_id` integer,
	`chanteur_2_id` integer
);
--> statement-breakpoint
INSERT INTO `__new_duels`("id", "song_choice", "chanteur_1_id", "chanteur_2_id") SELECT "id", "song_choice", "chanteur_1_id", "chanteur_2_id" FROM `duels`;--> statement-breakpoint
DROP TABLE `duels`;--> statement-breakpoint
ALTER TABLE `__new_duels` RENAME TO `duels`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_enregistrements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`song_choice` text NOT NULL,
	`duel_id` integer,
	`voice_url` text,
	`voice_uploadthing_key` text,
	`nb_likes` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_enregistrements`("id", "user_id", "song_choice", "duel_id", "voice_url", "voice_uploadthing_key", "nb_likes", "created_at") SELECT "id", "user_id", "song_choice", "duel_id", "voice_url", "voice_uploadthing_key", "nb_likes", "created_at" FROM `enregistrements`;--> statement-breakpoint
DROP TABLE `enregistrements`;--> statement-breakpoint
ALTER TABLE `__new_enregistrements` RENAME TO `enregistrements`;