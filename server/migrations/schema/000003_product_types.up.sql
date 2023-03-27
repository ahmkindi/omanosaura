BEGIN;

  create type product_kind as enum ('school', 'team', 'exp');

  create table if not exists product_kind_label (
    id product_kind primary key,
    label text not null,
    label_ar text not null
  );

  alter table products drop column kind cascade;
  alter table products add column kind product_kind not null
    references product_kind_label(id) default 'exp';

  insert into product_kind_label values
    ('school', 'School Trip', 'رحلة مدرسية'),
    ('team', 'Team Building', 'بناء فريق'),
    ('exp', 'Experience', 'تجربة');

  DROP VIEW available_products;
  CREATE VIEW available_products AS
  SELECT * FROM products WHERE is_deleted = false;

COMMIT;
