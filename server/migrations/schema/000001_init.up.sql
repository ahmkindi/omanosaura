BEGIN;

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('adventure', 'trip')),
  title TEXT NOT NULL,
	title_ar TEXT NOT NULL,
	subtitle TEXT NOT NULL,
	subtitle_ar TEXT NOT NULL,
	description TEXT NOT NULL,
	description_ar TEXT NOT NULL,
  photo TEXT NOT NULL,
  price_baisa BIGINT NOT NULL,
  planned_dates DATE[] NOT NULL DEFAULT ARRAY[]::DATE[],
  photos TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  longitude FLOAT NOT NULL,
  latitude FLOAT NOT NULL,
  last_updated DATE NOT NULL,
  is_deleted BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
	email TEXT UNIQUE NOT NULL,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
	phone TEXT NOT NULL,
  roles TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
);

CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  num_of_participants INTEGER NOT NULL,
  paid BOOLEAN NOT NULL,
  cost_baisa BIGINT NOT NULL,
  chosen_date DATE NOT NULL,
  complete BOOLEAN NOT NULL,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS reviews (
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  rating FLOAT NOT NULL CHECK (rating > 0 AND rating <= 5),
  title TEXT NOT NULL,
  review TEXT NOT NULL,
  last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
  PRIMARY KEY(product_id, user_id)
);

CREATE TABLE IF NOT EXISTS user_customer_id (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES users(id),
  customer_id TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  photo TEXT NOT NULL,
  page TEXT NOT NULL,
  page_ar TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE VIEW available_products AS
SELECT * FROM products WHERE is_deleted = false;

COMMIT;
