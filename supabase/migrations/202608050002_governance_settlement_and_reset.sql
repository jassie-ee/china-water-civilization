-- Formal challenge settlement and scoped progress reset.

create or replace function public.start_governance_challenge(p_level_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_attempt_id uuid := gen_random_uuid();
  v_question_count integer;
  v_level_stars smallint := 0;
  v_payload jsonb;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select count(*) into v_question_count
  from public.governance_questions q
  where q.level_id = p_level_id and q.is_active;

  if v_question_count <> 40 then
    raise exception 'This level needs exactly 40 active questions before it can be opened';
  end if;

  if not exists (
    select 1 from public.governance_levels l
    where l.id = p_level_id and l.is_published
  ) then
    raise exception 'Level is unavailable';
  end if;

  select earned_stars into v_level_stars
  from public.governance_level_progress
  where user_id = v_user_id and level_id = p_level_id;
  v_level_stars := coalesce(v_level_stars, 0);

  insert into public.governance_attempts (id, user_id, level_id)
  values (v_attempt_id, v_user_id, p_level_id);

  with unseen as (
    select q.id
    from public.governance_questions q
    where q.level_id = p_level_id
      and q.is_active
      and not exists (
        select 1
        from public.governance_question_exposures e
        where e.user_id = v_user_id
          and e.level_id = p_level_id
          and e.question_id = q.id
      )
    order by random()
    limit 8
  ), fallback as (
    select q.id
    from public.governance_questions q
    where q.level_id = p_level_id
      and q.is_active
      and not exists (select 1 from unseen u where u.id = q.id)
    order by random()
    limit greatest(0, 8 - (select count(*) from unseen))
  ), selected as (
    select id from unseen
    union all
    select id from fallback
  ), ordered as (
    select id, row_number() over ()::smallint as question_order
    from selected
  )
  insert into public.governance_attempt_questions (attempt_id, question_id, question_order)
  select v_attempt_id, id, question_order from ordered;

  insert into public.governance_question_exposures (user_id, level_id, question_id)
  select v_user_id, p_level_id, question_id
  from public.governance_attempt_questions
  where attempt_id = v_attempt_id
  on conflict do nothing;

  select jsonb_build_object(
    'attemptId', v_attempt_id,
    'levelStars', v_level_stars,
    'questions', coalesce(jsonb_agg(jsonb_build_object(
      'id', q.id,
      'scenario', q.scenario,
      'questionText', q.question_text,
      'options', (
        select jsonb_agg(jsonb_build_object(
          'id', o.id,
          'text', o.option_text,
          'order', o.option_order
        ) order by o.option_order)
        from public.governance_question_options o
        where o.question_id = q.id
      )
    ) order by aq.question_order), '[]'::jsonb)
  ) into v_payload
  from public.governance_attempt_questions aq
  join public.governance_questions q on q.id = aq.question_id
  where aq.attempt_id = v_attempt_id;

  return v_payload;
end;
$$;

create or replace function public.submit_governance_answer(
  p_attempt_id uuid,
  p_question_id uuid,
  p_option_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_level_id text;
  v_attempt_completed boolean := false;
  v_is_correct boolean;
  v_is_complete boolean := false;
  v_session_stars smallint := 0;
  v_question_stars smallint := 0;
  v_level_stars smallint := 0;
  v_explanation text;
begin
  select a.level_id, a.completed_at is not null
  into v_level_id, v_attempt_completed
  from public.governance_attempts a
  where a.id = p_attempt_id and a.user_id = v_user_id;

  if v_level_id is null then
    raise exception 'Attempt unavailable';
  end if;

  -- The final answer can be replayed safely after a network retry or click replay.
  if v_attempt_completed then
    select aq.is_correct, q.explanation, coalesce(progress.earned_stars, 0)
    into v_is_correct, v_explanation, v_level_stars
    from public.governance_attempt_questions aq
    join public.governance_questions q on q.id = aq.question_id
    left join public.governance_level_progress progress
      on progress.user_id = v_user_id and progress.level_id = v_level_id
    where aq.attempt_id = p_attempt_id and aq.question_id = p_question_id;

    if v_is_correct is null then
      raise exception 'Question unavailable';
    end if;

    return jsonb_build_object(
      'isCorrect', v_is_correct,
      'awardedStars', 0,
      'levelStars', v_level_stars,
      'isComplete', true,
      'explanation', v_explanation
    );
  end if;

  if not exists (
    select 1
    from public.governance_attempt_questions aq
    where aq.attempt_id = p_attempt_id
      and aq.question_id = p_question_id
      and aq.selected_option_id is null
  ) then
    raise exception 'Question unavailable';
  end if;

  select o.is_correct, q.explanation
  into v_is_correct, v_explanation
  from public.governance_question_options o
  join public.governance_questions q on q.id = o.question_id
  where o.id = p_option_id and o.question_id = p_question_id;

  if v_is_correct is null then
    raise exception 'Option unavailable';
  end if;

  update public.governance_attempt_questions
  set selected_option_id = p_option_id,
      is_correct = v_is_correct,
      answered_at = now()
  where attempt_id = p_attempt_id and question_id = p_question_id;

  select not exists (
    select 1
    from public.governance_attempt_questions aq
    where aq.attempt_id = p_attempt_id and aq.selected_option_id is null
  ) into v_is_complete;

  if v_is_complete then
    with inserted_rewards as (
      insert into public.governance_question_rewards (user_id, level_id, question_id)
      select v_user_id, v_level_id, aq.question_id
      from public.governance_attempt_questions aq
      where aq.attempt_id = p_attempt_id and aq.is_correct
      on conflict do nothing
      returning question_id
    ), reward_status as (
      select aq.question_id, ir.question_id as rewarded_question_id
      from public.governance_attempt_questions aq
      left join inserted_rewards ir on ir.question_id = aq.question_id
      where aq.attempt_id = p_attempt_id
    )
    update public.governance_attempt_questions aq
    set stars_awarded = case when status.rewarded_question_id is null then 0 else 3 end
    from reward_status status
    where aq.attempt_id = p_attempt_id and aq.question_id = status.question_id;

    select coalesce(sum(stars_awarded), 0)::smallint
    into v_session_stars
    from public.governance_attempt_questions
    where attempt_id = p_attempt_id;

    insert into public.governance_level_progress (user_id, level_id, earned_stars)
    values (v_user_id, v_level_id, v_session_stars)
    on conflict (user_id, level_id) do update
      set earned_stars = least(120, public.governance_level_progress.earned_stars + v_session_stars),
          updated_at = now()
    returning earned_stars into v_level_stars;

    select stars_awarded into v_question_stars
    from public.governance_attempt_questions
    where attempt_id = p_attempt_id and question_id = p_question_id;

    update public.governance_attempts
    set completed_at = now()
    where id = p_attempt_id;
  end if;

  return jsonb_build_object(
    'isCorrect', v_is_correct,
    'awardedStars', case when v_is_complete then v_question_stars else 0 end,
    'levelStars', case when v_is_complete then v_level_stars else null end,
    'isComplete', v_is_complete,
    'explanation', v_explanation
  );
end;
$$;

create or replace function public.get_governance_challenge_review(p_attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_payload jsonb;
begin
  if not exists (
    select 1
    from public.governance_attempts
    where id = p_attempt_id and user_id = v_user_id and completed_at is not null
  ) then
    raise exception 'Completed attempt unavailable';
  end if;

  select jsonb_build_object(
    'attemptId', p_attempt_id,
    'questions', coalesce(jsonb_agg(jsonb_build_object(
      'questionId', aq.question_id,
      'selectedOptionId', aq.selected_option_id,
      'correctOptionId', (
        select o.id
        from public.governance_question_options o
        where o.question_id = aq.question_id and o.is_correct
        limit 1
      ),
      'awardedStars', aq.stars_awarded,
      'explanation', q.explanation
    ) order by aq.question_order), '[]'::jsonb)
  ) into v_payload
  from public.governance_attempt_questions aq
  join public.governance_questions q on q.id = aq.question_id
  where aq.attempt_id = p_attempt_id;

  return v_payload;
end;
$$;

create or replace function public.reset_governance_progress(p_scope text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_scope not in ('all', 'yellow-river', 'yangtze-river') then
    raise exception 'Invalid reset scope';
  end if;

  delete from public.governance_level_progress progress
  using public.governance_levels level
  where progress.user_id = v_user_id
    and progress.level_id = level.id
    and (p_scope = 'all' or level.basin_id = p_scope);

  delete from public.governance_question_rewards reward
  using public.governance_levels level
  where reward.user_id = v_user_id
    and reward.level_id = level.id
    and (p_scope = 'all' or level.basin_id = p_scope);

  delete from public.governance_question_exposures exposure
  using public.governance_levels level
  where exposure.user_id = v_user_id
    and exposure.level_id = level.id
    and (p_scope = 'all' or level.basin_id = p_scope);
end;
$$;

grant execute on function public.start_governance_challenge(text) to authenticated;
grant execute on function public.submit_governance_answer(uuid, uuid, uuid) to authenticated;
grant execute on function public.get_governance_challenge_review(uuid) to authenticated;
grant execute on function public.reset_governance_progress(text) to authenticated;
