BEGIN;

  alter table products add constraint longitude_validate CHECK (longitude <= 180 and longitude >= -180);
  alter table products add constraint latitude_validate CHECK (latitude <= 90 and latitude >= -90);
  alter table products add column price_per integer not null default 4;

  -- need to update to get new column
  DROP VIEW available_products;
  CREATE VIEW available_products AS
  SELECT * FROM products WHERE is_deleted = false;

COMMIT;
