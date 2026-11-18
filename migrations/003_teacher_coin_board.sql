-- Coin totals for every student in a grade, for the teacher's reports.
-- Requires 002_gold_coins.sql (uses correct_count). Read-only: safe to run on the live database.

create or replace function coin_board(g int) returns table(student text, coins int)
language sql stable security definer as $$
  select min(a.student), coalesce(sum(correct_count(a)), 0)::int
  from attempts a
  join tests t on t.id = a.test_id
  where a.grade = g
    and (a.finished or now() >= t.end_at)
  group by lower(trim(a.student))
$$;

-- Teacher only: students should not be able to list everyone's names.
revoke execute on function coin_board(int) from public, anon;
grant execute on function coin_board(int) to authenticated;
