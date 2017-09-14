DROP DATABASE IF EXISTS site_cacher_innie_kim;
CREATE DATABASE site_cacher_innie_kim;

\c site_cacher_innie_kim;

CREATE TABLE IF NOT EXISTS queue (
  id SERIAL PRIMARY KEY,
  created_timestamp TIMESTAMP DEFAULT now() NOT NULL,
  processed BOOLEAN DEFAULT false NOT NULL,
  url TEXT NOT NULL,
  cache TEXT
);