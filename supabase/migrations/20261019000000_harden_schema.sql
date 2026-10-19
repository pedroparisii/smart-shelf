-- Smart Shelf — schema hardening
--
-- 1. Book data moves into user_books (one private copy per user). The shared
--    `books` table was written directly by clients, so any signed-in user could
--    overwrite a book's title/cover for everybody.
-- 2. `finished_at` records when a book was marked as read (the yearly goal used
--    `updated_at`, which changes whenever a note is edited).
-- 3. Every table gets owner-only RLS; profiles only allow editing safe columns.
-- 4. Onboarding data (username, genres, goal, format) is written by a trigger
--    from the signup metadata, so it works with email confirmation enabled.
--
-- Run once in the Supabase SQL editor (or `supabase db push`).

begin;

-- ── user_books: embed the book snapshot ─────────────────────────────────────
alter table public.user_books
  add column if not exists ol_id       text,
  add column if not exists title       text,
  add column if not exists authors     text[] not null default '{}',
  add column if not exists cover_url   text,
  add column if not exists genres      text[] not null default '{}',
  add column if not exists finished_at timestamptz;

update public.user_books ub set
  ol_id       = b.ol_id,
  title       = b.title,
  authors     = coalesce(string_to_array(b.authors, ', '), '{}'),
  cover_url   = b.cover_url,
  genres      = case when jsonb_typeof(to_jsonb(b.genres)) = 'array'
                     then array(select jsonb_array_elements_text(to_jsonb(b.genres)))
                     else '{}' end,
  finished_at = case when ub.status = 'read' then ub.updated_at end
from public.books b
where b.id = ub.book_id;

alter table public.user_books
  drop column book_id,
  alter column ol_id set not null,
  alter column title set not null,
  drop constraint if exists user_books_status_check,
  add constraint user_books_status_check check (status in ('saved', 'reading', 'read')),
  add constraint user_books_user_id_ol_id_key unique (user_id, ol_id);

drop table public.books;

-- ── Row Level Security: owner-only access ───────────────────────────────────
-- Drop whatever policies exist so the final state is exactly what's below.
do $$
declare p record;
begin
  for p in
    select policyname, tablename from pg_policies
    where schemaname = 'public'
      and tablename in ('profiles', 'user_books', 'user_genres', 'reading_goals')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

alter table public.profiles      enable row level security;
alter table public.user_books    enable row level security;
alter table public.user_genres   enable row level security;
alter table public.reading_goals enable row level security;

create policy "own profile" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own books" on public.user_books
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own genres" on public.user_genres
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own goals" on public.reading_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Grants: nothing for anon; profiles are read + edit-safe-columns only ────
revoke all on public.profiles, public.user_books, public.user_genres, public.reading_goals from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (display_name, bio, avatar_url, preferred_format) on public.profiles to authenticated;
grant select, insert, update, delete on public.user_books, public.user_genres, public.reading_goals to authenticated;

-- ── Signup trigger: profile + onboarding from auth metadata ────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}');
begin
  insert into public.profiles (user_id, display_name, preferred_format)
  values (new.id, left(meta->>'display_name', 25), meta->>'preferred_format')
  on conflict (user_id) do update
    set display_name     = excluded.display_name,
        preferred_format = excluded.preferred_format;

  insert into public.user_genres (user_id, genre)
  select new.id, g
  from jsonb_array_elements_text(coalesce(meta->'genres', '[]')) as g;

  if (meta->>'reading_goal') ~ '^\d+$' then
    insert into public.reading_goals (user_id, year, goal)
    values (new.id, extract(year from now())::int, least((meta->>'reading_goal')::int, 365));
  end if;

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

commit;
