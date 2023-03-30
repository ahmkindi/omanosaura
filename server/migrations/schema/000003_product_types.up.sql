BEGIN;

  create type product_kind as enum ('school', 'team', 'exp');

  DROP VIEW available_products;
  alter table products drop column kind;
  alter table products add column kind product_kind not null
    references product_kind_label(id) default 'exp';

  CREATE VIEW available_products AS
  SELECT * FROM products WHERE is_deleted = false;

COMMIT;
