BEGIN;

CREATE TABLE IF NOT EXISTS trips (
	id UUID PRIMARY KEY,
	title TEXT,
	title_ar TEXT,
	subtitle TEXT,
	subtitle_ar TEXT,
	description TEXT,
	description_ar TEXT,
	front_photo BYTEA
);

CREATE TABLE IF NOT EXISTS trip_photos (
	id UUID PRIMARY KEY,
	trip_id UUID REFERENCES trips(id),
	photo BYTEA
);

CREATE TABLE IF NOT EXISTS adventures (
	id UUID PRIMARY KEY,
	title TEXT,
	title_ar TEXT,
	description TEXT,
	description_ar TEXT,
	photo BYTEA
);

CREATE TABLE IF NOT EXISTS events (
	id UUID PRIMARY KEY,
	photo BYTEA,
	expiry DATE
);

COMMIT;
