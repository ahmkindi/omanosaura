BEGIN;

CREATE EXTENSION citext;

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY,
  kind CHAR(1) NOT NULL CHECK (kind IN ('A', 'T')),
  title TEXT NOT NULL,
	title_ar TEXT NOT NULL,
	description TEXT NOT NULL,
	description_ar TEXT NOT NULL,
  photo TEXT NOT NULL,
  price_baisa INT NOT NULL,
  last_udpated DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS adventures (
	id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  available_dates DATE[] NOT NULL DEFAULT ARRAY[]::DATE[]
);

CREATE TABLE IF NOT EXISTS trips (
	id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
	subtitle TEXT NOT NULL,
	subtitle_ar TEXT NOT NULL,
  photos TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
	email CITEXT UNIQUE NOT NULL,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
	phone TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  num_of_participants INTEGER NOT NULL,
  paid BOOLEAN NOT NULL,
  cost_baisa INTEGER NOT NULL,
  chosen_date DATE NOT NULL,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS reviews (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  review TEXT NOT NULL,
  last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
  PRIMARY KEY(product_id, user_id)
);

CREATE TABLE IF NOT EXISTS ratings (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at DATE NOT NULL DEFAULT CURRENT_DATE,
  rating FLOAT NOT NULL CHECK (rating > 0 AND rating <= 5),
  PRIMARY KEY(product_id, user_id)
);

CREATE TABLE IF NOT EXISTS user_customer_id (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES users(id),
  customer_id TEXT NOT NULL
);

COMMIT;
