-- =========================
-- CLEANUP
-- =========================
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user;
drop table if exists bookings cascade;
drop table if exists seats cascade;
drop table if exists members cascade;
drop table if exists libraries cascade;
drop table if exists profiles cascade;

-- Enable extensions
create extension if not exists "uuid-ossp";

-- =========================
-- TABLES
-- =========================

-- Profiles (User details)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  first_name text,
  last_name text,
  phone text,
  company text,
  updated_at timestamp with time zone default now()
);

-- Libraries (Multi-tenancy anchor)
create table libraries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default now()
);

-- Seats (Scoped to Library)
create table seats (
  id uuid primary key default gen_random_uuid(),
  library_id uuid references libraries(id) on delete cascade not null,
  seat_number text not null,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  unique(library_id, seat_number)
);

-- Members (Scoped to Library)
create table members (
  id uuid primary key default gen_random_uuid(),
  library_id uuid references libraries(id) on delete cascade not null,
  name text not null,
  email text not null,
  phone text,
  created_at timestamp with time zone default now(),
  unique(library_id, email)
);

-- Bookings (The core logic)
create table bookings (
  id uuid primary key default gen_random_uuid(),
  library_id uuid references libraries(id) on delete cascade not null,
  member_id uuid references members(id) on delete cascade not null,
  seat_id uuid references seats(id) on delete cascade not null,
  booking_date date not null,
  status text default 'active' check (status in ('active', 'cancelled', 'completed')),
  created_at timestamp with time zone default now()
);

-- =========================
-- CONSTRAINTS & VALIDATION
-- =========================

-- Prevent double-booking: Same seat, same date, active status
create unique index idx_unique_seat_booking_date 
on bookings (seat_id, booking_date) 
where (status = 'active');

-- Function to check booking rules
create or replace function check_booking_constraints()
returns trigger as $$
declare
  active_booking_count int;
  seat_active boolean;
begin
  -- 1. Date cannot be in the past
  if NEW.booking_date < current_date then
    raise exception 'Booking date cannot be in the past';
  end if;

  -- 2. Seat must be active
  select is_active into seat_active from seats where id = NEW.seat_id;
  if not seat_active then
    raise exception 'Cannot book a deactivated seat';
  end if;

  -- 3. Member cannot have more than 2 active bookings
  select count(*) into active_booking_count 
  from bookings 
  where member_id = NEW.member_id and status = 'active';
  
  if active_booking_count >= 2 then
    raise exception 'Member already has 2 active bookings';
  end if;

  return NEW;
end;
$$ language plpgsql;

create trigger trg_check_booking_constraints
before insert on bookings
for each row execute procedure check_booking_constraints();

-- =========================
-- AUTOMATION (TRIGGER ON SIGNUP)
-- =========================

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
  new_lib_id uuid;
begin
  -- 1. Create Profile
  insert into public.profiles (id, first_name, last_name, phone, company)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'company'
  );

  -- 2. Create Default Library for the Owner
  insert into public.libraries (owner_id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'library_name', (new.raw_user_meta_data->>'first_name' || '''s Library'))
  )
  returning id into new_lib_id;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure handle_new_user();

-- =========================
-- SECURITY (RLS)
-- =========================

alter table profiles enable row level security;
alter table libraries enable row level security;
alter table seats enable row level security;
alter table members enable row level security;
alter table bookings enable row level security;

-- Profiles: Own view/update
create policy "Users can manage own profile" on profiles for all using (auth.uid() = id);

-- Libraries: Only owner can manage
create policy "Owners can manage their libraries" on libraries for all using (auth.uid() = owner_id);

-- Members, Seats, Bookings: Filtered by library ownership
create policy "Owners can manage library members" on members for all 
using (library_id in (select id from libraries where owner_id = auth.uid()));

create policy "Owners can manage library seats" on seats for all 
using (library_id in (select id from libraries where owner_id = auth.uid()));

create policy "Owners can manage library bookings" on bookings for all 
using (library_id in (select id from libraries where owner_id = auth.uid()));
