
INSERT INTO "MatchEvents" ("id", "content", "created_at", "match_id", "initiator_id") VALUES
(1,	'test event',	'2023-12-08 11:14:26.192673',	1,	1);
INSERT INTO "MatchPlayers" ("match_id", "user_id") VALUES
(1,	1),
(1,	2);INSERT INTO "Matches" ("id", "created_at", "game_id") VALUES
(1,	'2023-12-08 11:13:31.727583',	1);
INSERT INTO "UserMessages" ("id", "content", "created_at", "sender_id", "receiver_id") VALUES
(1,	'hello world',	'2023-12-08 11:15:05.209358',	1,	2);INSERT INTO "UserRelations" ("sender_id", "receptor_id", "status") VALUES
(1,	2,	1);

