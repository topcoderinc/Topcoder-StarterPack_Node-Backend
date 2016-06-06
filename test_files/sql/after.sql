SELECT pg_catalog.setval('games_id_seq', 3115, true);

ALTER TABLE ONLY games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);
