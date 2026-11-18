-- Gold coins: one coin for every correctly answered question, summed over all of a
-- student's attempts that are finished (or whose test has ended).
-- Read-only and additive: safe to run on the live database. Run once in the Supabase SQL Editor.

create or replace function correct_count(a attempts) returns int language sql stable as $$
  select count(*)::int
  from questions q
  where q.test_id = a.test_id
    and (a.answers->(q.id::text)->>'a')::int = q.correct
$$;

create or replace function get_coins(nm text, g int) returns int language sql stable security definer as $$
  select coalesce(sum(correct_count(a)), 0)::int
  from attempts a
  join tests t on t.id = a.test_id
  where lower(a.student) = lower(trim(nm))
    and a.grade = g
    and (a.finished or now() >= t.end_at)
$$;

grant execute on function get_coins(text, int) to anon, authenticated;
