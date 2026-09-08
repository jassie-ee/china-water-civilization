-- 账户显示名：允许用户维护自己的公开显示名，不改动题库、积分或答题记录。
alter table public.profiles
  add constraint profiles_display_name_not_blank
  check (display_name is null or length(btrim(display_name)) > 0);

create policy "profiles owner updates display name"
on public.profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id and length(btrim(display_name)) > 0);
