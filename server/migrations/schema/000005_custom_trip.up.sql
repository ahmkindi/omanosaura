BEGIN;

  create type custom_trip_type as enum ('city_tour', 'easy_adv', 'med_adv', 'hard_adv');

  create table if not exists custom_trips (
    id serial primary key,
    trip_type custom_trip_type not null,
    trip_title text not null,
    trip_title_ar text not null
  );

  create table if not exists user_requests (
    id serial primary key,
    email text not null,
    start_date date not null,
    created_at timestamp not null,
    num_of_participants integer not null,
    include_equipment boolean not null,
    include_car boolean not null,
    include_guide boolean not null,
    luxury_rating integer not null
  );

  create table if not exists user_request_trips (
    user_request_id integer references user_requests(id),
    custom_trip_id integer references custom_trips(id),
    primary key(user_request_id, custom_trip_id)
  );

  -- Inserting city tours
  INSERT INTO custom_trips (trip_type, trip_title, trip_title_ar)
  VALUES 
    ('city_tour', 'Muscat', 'مسقط'),
    ('city_tour', 'Nizwa', 'نزوى'),
    ('city_tour', 'Sur', 'صور'),
    ('city_tour', 'Rustaq', 'الرستاق'),
    ('city_tour', 'Misfat Al Abryin', 'مسفاة العبريين'),
    ('city_tour', 'Jabel Akhdar', 'الجبل الأخضر'),
    ('city_tour', 'Bidiya', 'بديية');

  -- Inserting Easy Adventures
  INSERT INTO custom_trips (trip_type, trip_title, trip_title_ar)
  VALUES 
    ('easy_adv', 'small snake canyon', 'وادي الثعبان الصغير'),
    ('easy_adv', 'wadi Hawer', 'وادي حور'),
    ('easy_adv', 'Wadi Shab', 'وادي شاب'),
    ('easy_adv', 'wadi mebam (no abseiling)', 'وادي ميبم بدون تسلق'),
    ('easy_adv', 'Wadi Al Hawqayn', 'وادي الحوقين');

  -- Inserting Medium Adventures
  INSERT INTO custom_trips (trip_type, trip_title, trip_title_ar)
  VALUES 
    ('med_adv', 'Big snake canyon', 'وادي الثعبان الكبير'),
    ('med_adv', 'Wadi hawer to Saqe (abseiling)', 'وادي حاور إلى صقي مع التسلق'),
    ('med_adv', 'Wadi Mebam (abseiling)', 'وادي ميبم مع التسلق'),
    ('med_adv', 'Vai farrta Jabel Akhdar', 'فاي فرتا الجبل الأخضر');

  -- Inserting Difficult Adventures
  INSERT INTO custom_trips (trip_type, trip_title, trip_title_ar)
  VALUES 
    ('hard_adv', 'wadi Taab', 'وادي تعب'),
    ('hard_adv', 'Jebel Shams summit trail', 'مسار قمة جبل شمس'),
    ('hard_adv', 'A path from Wakan to Hadash', 'مسار من وكان إلى حدش'),
    ('hard_adv', 'Vai farrta Jebel Sham', 'فاي فرتا جبل شمس');

COMMIT;
