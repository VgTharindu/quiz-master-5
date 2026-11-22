-- QUIZ MASTER 5: coins + teacher reports + security, in one script.
-- Works on any existing database whether or not 002 and 003 were run, and is safe to run again.
--
-- BEFORE RUNNING: replace TEACHER_EMAIL below with the email the teacher logs in with.
-- The script stops with an error if that account is not found, so nobody gets locked out.
--
-- AFTER RUNNING: Supabase dashboard -> Authentication -> Sign In / Providers ->
-- turn OFF "Allow new users to sign up". Only the teacher account should exist.

-- 1. Teachers list. Only these accounts may read or change tables directly.
create table if not exists teachers (user_id uuid primary key references auth.users on delete cascade);
alter table teachers enable row level security;

insert into teachers (user_id)
select id from auth.users where lower(email) = lower('TEACHER_EMAIL')
on conflict do nothing;

do $$
begin
  if not exists (select 1 from teachers) then
    raise exception 'Teacher account not found. Put the teacher login email in place of TEACHER_EMAIL and run again.';
  end if;
end $$;

create or replace function is_teacher() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from teachers where user_id = auth.uid())
$$;

-- 2. New attempt columns: which device owns it, and how often the child left the test screen.
alter table attempts add column if not exists device_key text;
alter table attempts add column if not exists left_count int not null default 0;

-- 3. Replace "any logged-in user can do anything" with "teachers only".
drop policy if exists a on tests;
drop policy if exists a on questions;
drop policy if exists a on attempts;
drop policy if exists teacher_all on tests;
drop policy if exists teacher_all on questions;
drop policy if exists teacher_all on attempts;
create policy teacher_all on tests for all to authenticated using (is_teacher()) with check (is_teacher());
create policy teacher_all on questions for all to authenticated using (is_teacher()) with check (is_teacher());
create policy teacher_all on attempts for all to authenticated using (is_teacher()) with check (is_teacher());

drop policy if exists up on storage.objects;
drop policy if exists teacher_upload on storage.objects;
create policy teacher_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'qimg' and is_teacher());

-- 4. Scoring helpers (from 002).
create or replace function score_of(a attempts) returns int
language sql stable set search_path = public as $$
  select coalesce(sum(q.marks), 0)::int from questions q
  where q.test_id = a.test_id and (a.answers->(q.id::text)->>'a')::int = q.correct
$$;

create or replace function correct_count(a attempts) returns int
language sql stable set search_path = public as $$
  select count(*)::int from questions q
  where q.test_id = a.test_id and (a.answers->(q.id::text)->>'a')::int = q.correct
$$;

-- 5. Student functions.
create or replace function list_tests(g int)
returns table(id uuid, name text, start_at timestamptz, end_at timestamptz, now_ts timestamptz)
language sql security definer set search_path = public as $$
  select id, name, start_at, end_at, now() from tests
  where grade = g and end_at > now() - interval '7 days' order by start_at
$$;

-- A name already in use on another device cannot be taken over while the test is running
-- (stops one child changing another child's answers). dk is optional so the app keeps
-- working whichever is updated first.
drop function if exists start_attempt(uuid, text, int);
create or replace function start_attempt(tid uuid, nm text, g int, dk text default null) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  t tests;
  a attempts;
  clean text := regexp_replace(trim(coalesce(nm, '')), '\s+', ' ', 'g');
  aid uuid;
begin
  if length(clean) < 2 or length(clean) > 60 then raise exception 'bad name'; end if;
  if dk is not null and length(dk) > 64 then raise exception 'bad key'; end if;
  select * into t from tests where id = tid and grade = g;
  if t.id is null then raise exception 'no test'; end if;

  select * into a from attempts where test_id = tid and lower(student) = lower(clean);
  if a.id is not null then
    if a.finished or now() >= t.end_at then return a.id; end if;
    if a.device_key is null then
      update attempts set device_key = dk where id = a.id;
      return a.id;
    end if;
    if a.device_key = dk then return a.id; end if;
    raise exception 'taken';
  end if;

  if now() < t.start_at or now() >= t.end_at then raise exception 'closed'; end if;
  insert into attempts (test_id, student, grade, device_key) values (tid, clean, g, dk) returning id into aid;
  return aid;
end $$;

-- Questions never include the correct answer.
create or replace function get_questions(aid uuid) returns json
language plpgsql security definer set search_path = public as $$
declare a attempts; t tests;
begin
  select * into a from attempts where id = aid;
  select * into t from tests where id = a.test_id;
  return json_build_object(
    'now', now(), 'end_at', t.end_at, 'finished', a.finished or now() >= t.end_at, 'answers', a.answers,
    'qs', (select coalesce(json_agg(json_build_object(
      'id', q.id, 'body', q.body, 'image_url', q.image_url, 'options', q.options,
      'marks', q.marks, 'seconds', q.seconds) order by q.pos), '[]'::json)
      from questions q where q.test_id = t.id));
end $$;

-- Rejects oversized payloads.
create or replace function save_answers(aid uuid, ans jsonb) returns void
language sql security definer set search_path = public as $$
  update attempts set answers = ans
  where id = aid and not finished
    and jsonb_typeof(ans) = 'object'
    and octet_length(ans::text) < 20000
    and now() < (select end_at from tests where id = test_id)
$$;

create or replace function finish_attempt(aid uuid) returns void
language sql security definer set search_path = public as $$
  update attempts set finished = true, finished_at = now() where id = aid and not finished
$$;

-- Counts how often a child switched away from the test (another app, tab or AI tool).
create or replace function note_leave(aid uuid) returns void
language sql security definer set search_path = public as $$
  update attempts set left_count = left_count + 1
  where id = aid and not finished
    and now() < (select end_at from tests where id = test_id)
$$;

-- Correct answers are shown as soon as the child submits; correct_count lets the app count coins.
create or replace function get_result(aid uuid) returns json
language plpgsql security definer set search_path = public as $$
declare a attempts; t tests; sc int; rk int;
begin
  select * into a from attempts where id = aid;
  select * into t from tests where id = a.test_id;
  if not (a.finished or now() >= t.end_at) then raise exception 'not yet'; end if;
  sc := score_of(a);
  select 1 + count(*) into rk from attempts x where x.test_id = t.id and score_of(x) > sc;
  return json_build_object(
    'score', sc,
    'total', (select sum(marks) from questions where test_id = t.id),
    'rank', rk,
    'count', (select count(*) from attempts where test_id = t.id),
    'correct_count', correct_count(a),
    'items', (
      select json_agg(json_build_object(
        'body', q.body, 'image_url', q.image_url, 'options', q.options, 'correct', q.correct,
        'marks', q.marks, 'mine', (a.answers->(q.id::text)->>'a')) order by q.pos)
      from questions q where q.test_id = t.id));
end $$;

-- One coin for every correct answer in finished attempts (from 002).
create or replace function get_coins(nm text, g int) returns int
language sql stable security definer set search_path = public as $$
  select coalesce(sum(correct_count(a)), 0)::int
  from attempts a
  join tests t on t.id = a.test_id
  where lower(a.student) = lower(trim(nm))
    and a.grade = g
    and (a.finished or now() >= t.end_at)
$$;

-- Every child's coin total, teachers only (from 003).
create or replace function coin_board(g int) returns table(student text, coins int)
language sql stable security definer set search_path = public as $$
  select min(a.student), coalesce(sum(correct_count(a)), 0)::int
  from attempts a
  join tests t on t.id = a.test_id
  where is_teacher()
    and a.grade = g
    and (a.finished or now() >= t.end_at)
  group by lower(trim(a.student))
$$;

-- 6. Who may call what.
grant execute on function list_tests(int) to anon, authenticated;
grant execute on function start_attempt(uuid, text, int, text) to anon, authenticated;
grant execute on function get_questions(uuid) to anon, authenticated;
grant execute on function save_answers(uuid, jsonb) to anon, authenticated;
grant execute on function finish_attempt(uuid) to anon, authenticated;
grant execute on function note_leave(uuid) to anon, authenticated;
grant execute on function get_result(uuid) to anon, authenticated;
grant execute on function get_coins(text, int) to anon, authenticated;
revoke execute on function coin_board(int) from public, anon;
grant execute on function coin_board(int) to authenticated;
