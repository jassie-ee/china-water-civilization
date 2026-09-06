-- 珠江闯关题目尚未配置；预先开放流域标识与按流域清空能力，确保题目上线后积分可即时同步。
alter table public.governance_levels
  drop constraint if exists governance_levels_basin_id_check;

alter table public.governance_levels
  add constraint governance_levels_basin_id_check
  check (basin_id in ('yellow-river', 'yangtze-river', 'pearl-river'));

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

  if p_scope not in ('all', 'yellow-river', 'yangtze-river', 'pearl-river') then
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

grant execute on function public.reset_governance_progress(text) to authenticated;
