SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;
SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;
CREATE TABLE games (
    id integer NOT NULL,
    "gameId" text,
    name text,
    image text,
    thumbnail text,
    "minPlayers" integer,
    "maxPlayers" integer,
    "playingTime" integer,
    "isExpansion" boolean,
    "yearPublished" integer,
    "bggRating" double precision,
    "averageRating" double precision,
    rank integer,
    "numPlays" integer,
    rating integer,
    owned boolean,
    "preOrdered" boolean,
    "forTrade" boolean,
    "previousOwned" boolean,
    want boolean,
    "wantToPlay" boolean,
    "wantToBuy" boolean,
    "wishList" boolean,
    "userComment" text
);
CREATE SEQUENCE games_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE games_id_seq OWNED BY games.id;

ALTER TABLE ONLY games ALTER COLUMN id SET DEFAULT nextval('games_id_seq'::regclass);
