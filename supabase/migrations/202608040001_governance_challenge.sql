-- 中华水生态文明互动系统：账号、随机题库与封顶积分。
-- 在 Supabase SQL Editor 或 Supabase CLI migration 中执行；不包含任何正式题目数据。

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  migration_token uuid not null default gen_random_uuid(),
  claimed_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.create_profile_for_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.create_profile_for_user();

create table if not exists public.governance_levels (
  id text primary key,
  basin_id text not null check (basin_id in ('yellow-river', 'yangtze-river')),
  title text not null,
  description text not null default '',
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.governance_questions (
  id uuid primary key default gen_random_uuid(),
  level_id text not null references public.governance_levels(id) on delete cascade,
  scenario text not null default '',
  question_text text not null,
  explanation text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.governance_question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.governance_questions(id) on delete cascade,
  option_order smallint not null check (option_order between 1 and 3),
  option_text text not null,
  is_correct boolean not null default false,
  unique (question_id, option_order)
);

create table if not exists public.governance_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  level_id text not null references public.governance_levels(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.governance_attempt_questions (
  attempt_id uuid not null references public.governance_attempts(id) on delete cascade,
  question_id uuid not null references public.governance_questions(id) on delete restrict,
  question_order smallint not null check (question_order between 1 and 8),
  selected_option_id uuid references public.governance_question_options(id) on delete restrict,
  is_correct boolean,
  stars_awarded smallint not null default 0 check (stars_awarded in (0, 3)),
  answered_at timestamptz,
  primary key (attempt_id, question_id),
  unique (attempt_id, question_order)
);

create table if not exists public.governance_question_exposures (
  user_id uuid not null references auth.users(id) on delete cascade,
  level_id text not null references public.governance_levels(id) on delete cascade,
  question_id uuid not null references public.governance_questions(id) on delete cascade,
  first_seen_at timestamptz not null default now(),
  primary key (user_id, level_id, question_id)
);

-- 同一道题只在首次答对时贡献 3 星；重复题用于补足此前答错的知识点。
create table if not exists public.governance_question_rewards (
  user_id uuid not null references auth.users(id) on delete cascade,
  level_id text not null references public.governance_levels(id) on delete cascade,
  question_id uuid not null references public.governance_questions(id) on delete cascade,
  rewarded_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

create table if not exists public.governance_level_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  level_id text not null references public.governance_levels(id) on delete cascade,
  earned_stars smallint not null default 0 check (earned_stars between 0 and 120),
  updated_at timestamptz not null default now(),
  primary key (user_id, level_id)
);

alter table public.profiles enable row level security;
alter table public.governance_levels enable row level security;
alter table public.governance_questions enable row level security;
alter table public.governance_question_options enable row level security;
alter table public.governance_attempts enable row level security;
alter table public.governance_attempt_questions enable row level security;
alter table public.governance_question_exposures enable row level security;
alter table public.governance_question_rewards enable row level security;
alter table public.governance_level_progress enable row level security;

create policy "profiles are private" on public.profiles for select using (auth.uid() = user_id);
create policy "published levels are readable" on public.governance_levels for select using (is_published);
create policy "users read own attempts" on public.governance_attempts for select using (auth.uid() = user_id);
create policy "users read own attempt questions" on public.governance_attempt_questions for select using (exists (select 1 from public.governance_attempts a where a.id = attempt_id and a.user_id = auth.uid()));
create policy "users read own progress" on public.governance_level_progress for select using (auth.uid() = user_id);

-- 仅通过函数抽题，避免 options.is_correct 被客户端直接查询。
create or replace function public.start_governance_challenge(p_level_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid := auth.uid();
  v_attempt_id uuid := gen_random_uuid();
  v_question_count integer;
  v_payload jsonb;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  select count(*) into v_question_count from public.governance_questions q where q.level_id = p_level_id and q.is_active;
  if v_question_count <> 40 then raise exception 'This level needs exactly 40 active questions before it can be opened'; end if;
  if not exists (select 1 from public.governance_levels l where l.id = p_level_id and l.is_published) then raise exception 'Level is unavailable'; end if;

  insert into public.governance_attempts (id, user_id, level_id) values (v_attempt_id, v_user_id, p_level_id);
  with unseen as (
    select q.id from public.governance_questions q
    where q.level_id = p_level_id and q.is_active
      and not exists (select 1 from public.governance_question_exposures e where e.user_id = v_user_id and e.level_id = p_level_id and e.question_id = q.id)
    order by random() limit 8
  ), fallback as (
    select q.id from public.governance_questions q
    where q.level_id = p_level_id and q.is_active and not exists (select 1 from unseen u where u.id = q.id)
    order by random() limit greatest(0, 8 - (select count(*) from unseen))
  ), selected as (
    select id from unseen
    union all
    select id from fallback
  ), ordered as (
    select id, row_number() over ()::smallint as question_order from selected
  )
  insert into public.governance_attempt_questions (attempt_id, question_id, question_order)
  select v_attempt_id, id, question_order from ordered;

  insert into public.governance_question_exposures (user_id, level_id, question_id)
  select v_user_id, p_level_id, question_id from public.governance_attempt_questions where attempt_id = v_attempt_id
  on conflict do nothing;

  select jsonb_build_object('attemptId', v_attempt_id, 'questions', coalesce(jsonb_agg(jsonb_build_object(
    'id', q.id, 'scenario', q.scenario, 'questionText', q.question_text,
    'options', (select jsonb_agg(jsonb_build_object('id', o.id, 'text', o.option_text, 'order', o.option_order) order by o.option_order) from public.governance_question_options o where o.question_id = q.id)
  ) order by aq.question_order), '[]'::jsonb)) into v_payload
  from public.governance_attempt_questions aq join public.governance_questions q on q.id = aq.question_id
  where aq.attempt_id = v_attempt_id;
  return v_payload;
end;
$$;

create or replace function public.submit_governance_answer(p_attempt_id uuid, p_question_id uuid, p_option_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid := auth.uid();
  v_level_id text;
  v_is_correct boolean;
  v_new_reward boolean := false;
  v_inserted integer := 0;
  v_awarded smallint := 0;
  v_total smallint;
  v_explanation text;
begin
  select a.level_id into v_level_id from public.governance_attempts a where a.id = p_attempt_id and a.user_id = v_user_id and a.completed_at is null;
  if v_level_id is null then raise exception 'Attempt unavailable'; end if;
  if not exists (select 1 from public.governance_attempt_questions where attempt_id = p_attempt_id and question_id = p_question_id and selected_option_id is null) then raise exception 'Question unavailable'; end if;
  select o.is_correct, q.explanation into v_is_correct, v_explanation from public.governance_question_options o join public.governance_questions q on q.id = o.question_id where o.id = p_option_id and o.question_id = p_question_id;
  if v_is_correct is null then raise exception 'Option unavailable'; end if;
  if v_is_correct then
    insert into public.governance_question_rewards (user_id, level_id, question_id) values (v_user_id, v_level_id, p_question_id) on conflict do nothing;
    get diagnostics v_inserted = row_count;
    v_new_reward := v_inserted > 0;
    if v_new_reward then v_awarded := 3; end if;
  end if;
  insert into public.governance_level_progress (user_id, level_id, earned_stars) values (v_user_id, v_level_id, v_awarded)
  on conflict (user_id, level_id) do update set earned_stars = least(120, public.governance_level_progress.earned_stars + v_awarded), updated_at = now()
  returning earned_stars into v_total;
  update public.governance_attempt_questions set selected_option_id = p_option_id, is_correct = v_is_correct, stars_awarded = v_awarded, answered_at = now() where attempt_id = p_attempt_id and question_id = p_question_id;
  return jsonb_build_object('isCorrect', v_is_correct, 'awardedStars', v_awarded, 'levelStars', v_total, 'explanation', v_explanation);
end;
$$;

grant execute on function public.start_governance_challenge(text) to authenticated;
grant execute on function public.submit_governance_answer(uuid, uuid, uuid) to authenticated;

-- 登录前由匿名身份读取一次 migration_token；登录后只有持有该令牌的账户可认领该游客数据。
create or replace function public.claim_guest_progress(p_guest_id uuid, p_migration_token uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null or v_user_id = p_guest_id then raise exception 'A signed-in account is required'; end if;
  if not exists (select 1 from public.profiles where user_id = p_guest_id and migration_token = p_migration_token and claimed_at is null) then
    raise exception 'Guest migration is unavailable';
  end if;

  insert into public.governance_question_exposures (user_id, level_id, question_id, first_seen_at)
  select v_user_id, level_id, question_id, first_seen_at from public.governance_question_exposures where user_id = p_guest_id
  on conflict do nothing;
  insert into public.governance_question_rewards (user_id, level_id, question_id, rewarded_at)
  select v_user_id, level_id, question_id, rewarded_at from public.governance_question_rewards where user_id = p_guest_id
  on conflict do nothing;
  update public.governance_attempts set user_id = v_user_id where user_id = p_guest_id;
  insert into public.governance_level_progress (user_id, level_id, earned_stars)
  select v_user_id, level_id, least(120, count(*) * 3)::smallint
  from public.governance_question_rewards where user_id = v_user_id group by level_id
  on conflict (user_id, level_id) do update set earned_stars = excluded.earned_stars, updated_at = now();
  update public.profiles set claimed_at = now(), migration_token = gen_random_uuid() where user_id = p_guest_id;
end;
$$;

grant execute on function public.claim_guest_progress(uuid, uuid) to authenticated;
