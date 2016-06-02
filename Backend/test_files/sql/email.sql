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

-- delete previous table if needed
DROP TABLE IF EXISTS emails;

CREATE TABLE emails (
    id      serial primary key,
    mgid    text NOT NULL,
    data    json NOT NULL 
);

-- grant access if needed
GRANT ALL PRIVILEGES ON TABLE emails TO PUBLIC;
GRANT USAGE, SELECT ON SEQUENCE emails_id_seq TO PUBLIC;