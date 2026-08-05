-- 正式题库完成后才允许读取逐题复盘；答题进行中不向浏览器公开正确选项。

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
  if not exists (select 1 from public.governance_attempt_questions where attempt_id = p_attempt_id and selected_option_id is null) then
    update public.governance_attempts set completed_at = now() where id = p_attempt_id;
  end if;
  return jsonb_build_object('isCorrect', v_is_correct, 'awardedStars', v_awarded, 'levelStars', v_total, 'explanation', v_explanation);
end;
$$;

-- 兼容本迁移上线前已答完的挑战：这些记录没有机会在最后一题写入 completed_at。
update public.governance_attempts a
set completed_at = now()
where a.completed_at is null
  and exists (select 1 from public.governance_attempt_questions aq where aq.attempt_id = a.id)
  and not exists (
    select 1 from public.governance_attempt_questions aq
    where aq.attempt_id = a.id and aq.selected_option_id is null
  );

create or replace function public.get_governance_challenge_review(p_attempt_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid := auth.uid();
  v_payload jsonb;
begin
  if not exists (
    select 1 from public.governance_attempts
    where id = p_attempt_id and user_id = v_user_id and completed_at is not null
  ) then
    raise exception 'Completed attempt unavailable';
  end if;

  select jsonb_build_object(
    'attemptId', p_attempt_id,
    'questions', coalesce(jsonb_agg(jsonb_build_object(
      'questionId', aq.question_id,
      'selectedOptionId', aq.selected_option_id,
      'correctOptionId', (select o.id from public.governance_question_options o where o.question_id = aq.question_id and o.is_correct limit 1),
      'explanation', q.explanation
    ) order by aq.question_order), '[]'::jsonb)
  ) into v_payload
  from public.governance_attempt_questions aq
  join public.governance_questions q on q.id = aq.question_id
  where aq.attempt_id = p_attempt_id;
  return v_payload;
end;
$$;

grant execute on function public.get_governance_challenge_review(uuid) to authenticated;
