BEGIN;

  CREATE TYPE user_role AS ENUM ('none', 'admin', 'writer');

  ALTER TABLE products RENAME COLUMN price_baisa TO base_price_baisa;
  ALTER TABLE products ADD COLUMN extra_price_baisa BIGINT NOT NULL DEFAULT 0;

  ALTER TABLE users
	  DROP COLUMN firstname,
	  DROP COLUMN lastname,
    DROP COLUMN roles;
  ALTER TABLE users ADD COLUMN role user_role NOT NULL default 'none';
  ALTER TABLE users ADD COLUMN name TEXT NOT NULL default '';

  ALTER TABLE purchases ADD COLUMN extra_price_chosen BOOLEAN NOT NULL DEFAULT false;

COMMIT;
