BEGIN;

  ALTER TABLE products RENAME COLUMN price_baisa TO base_price_baisa;
  ALTER TABLE products ADD COLUMN extra_price_baisa BIGINT NOT NULL DEFAULT 0;
  ALTER TABLE purchases ADD COLUMN extra_price_chosen BOOLEAN NOT NULL DEFAULT false;

  DROP VIEW available_products;
  CREATE VIEW available_products AS
  SELECT * FROM products WHERE is_deleted = false;

COMMIT;
