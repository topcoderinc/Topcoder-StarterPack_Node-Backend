CREATE TABLE demo
(
  id serial NOT NULL,
  name character varying(5),
  "json" json, -- json
   tags integer[], -- integer array,
   "timestamp" timestamp ,
  CONSTRAINT demo_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
