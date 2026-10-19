-- Smart Shelf — initial schema
--
-- Every table is private to its owner (RLS). Profiles only allow editing
-- safe columns. A trigger creates the profile and onboarding rows (genres,
-- reading goal) from the signup metadata, so it works with email confirmation.
--
-- Run once in the Supabase SQL editor (or `supabase db push`).

begin;

-- ── Tables ───────────────────────────────────────────────────────────────────
create table public.profiles (
  user_id          uuid primary key references auth.users on delete cascade,
  display_name     text check (char_length(display_name) <= 25),
  bio              text check (char_length(bio) <= 500),
  avatar_url       text check (avatar_url ~ '^https://'),
  preferred_format text check (preferred_format in ('physical', 'digital', 'audiobook')),
  created_at       timestamptz not null default now()
);

create table public.user_genres (
  user_id uuid not null references auth.users on delete cascade,
  genre   text not null,
  primary key (user_id, genre)
);

create table public.reading_goals (
  user_id uuid not null references auth.users on delete cascade,
  year    int  not null,
  goal    int  not null check (goal between 1 and 365),
  primary key (user_id, year)
);

-- Each row keeps a small snapshot of its book, so nothing is shared between users
create table public.user_books (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  ol_id       text not null,
  title       text not null,
  authors     text[] not null default '{}',
  cover_url   text,
  genres      text[] not null default '{}',
  status      text not null check (status in ('saved', 'reading', 'read')),
  note        text check (char_length(note) <= 10000),
  updated_at  timestamptz not null default now(),
  finished_at timestamptz,
  unique (user_id, ol_id)
);

-- ── Row Level Security: owner-only access ───────────────────────────────────
alter table public.profiles      enable row level security;
alter table public.user_books    enable row level security;
alter table public.user_genres   enable row level security;
alter table public.reading_goals enable row level security;

create policy "own profile" on public.profiles
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own books" on public.user_books
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own genres" on public.user_genres
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own goals" on public.reading_goals
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Grants: nothing for anon; profiles are read + edit-safe-columns only ────
revoke all on public.profiles, public.user_books, public.user_genres, public.reading_goals from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (display_name, bio, avatar_url, preferred_format) on public.profiles to authenticated;
grant select, insert, update, delete on public.user_books, public.user_genres, public.reading_goals to authenticated;

-- ── Signup trigger: profile + onboarding from auth metadata ────────────────
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta   jsonb := coalesce(new.raw_user_meta_data, '{}');
  format text  := meta->>'preferred_format';
begin
  insert into public.profiles (user_id, display_name, preferred_format)
  values (
    new.id,
    left(meta->>'display_name', 25),
    case when format in ('physical', 'digital', 'audiobook') then format end
  );

  insert into public.user_genres (user_id, genre)
  select distinct new.id, left(g, 30)
  from jsonb_array_elements_text(
    case when jsonb_typeof(meta->'genres') = 'array' then meta->'genres' else '[]' end
  ) as g
  limit 20;

  if (meta->>'reading_goal') ~ '^\d{1,3}$' and (meta->>'reading_goal')::int between 1 and 365 then
    insert into public.reading_goals (user_id, year, goal)
    values (new.id, extract(year from now())::int, (meta->>'reading_goal')::int);
  end if;

  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

commit;
