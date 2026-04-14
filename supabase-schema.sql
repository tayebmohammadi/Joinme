create table if not exists public.users (
  id text primary key,
  email text unique not null,
  display_name text not null,
  password text not null,
  verified boolean not null default false,
  verification_code text,
  created_at timestamptz not null default now(),
  favorite_group_ids jsonb not null default '[]'::jsonb,
  reset_code text
);

create table if not exists public.groups (
  id text primary key,
  owner_id text not null,
  name text not null,
  title text not null,
  description text not null,
  capacity integer not null,
  visibility text not null,
  meeting_type text not null,
  meeting_detail text not null,
  space text not null,
  visual_id text,
  date_time timestamptz,
  end_date_time timestamptz,
  member_ids jsonb not null default '[]'::jsonb,
  waitlist_ids jsonb not null default '[]'::jsonb,
  join_requests jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.groups enable row level security;

drop policy if exists "allow all users table" on public.users;
create policy "allow all users table"
on public.users
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "allow all groups table" on public.groups;
create policy "allow all groups table"
on public.groups
for all
to anon, authenticated
using (true)
with check (true);

