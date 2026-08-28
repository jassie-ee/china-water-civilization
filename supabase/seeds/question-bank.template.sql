-- 正式题库导入模板：每个已发布关卡必须有 40 道 active 题，且每题恰有 3 个选项、仅 1 项正确。
-- 不要把此文件中的示例数据直接标记为 published。

insert into public.governance_levels (id, basin_id, title, description, is_published)
values ('example-level', 'yellow-river', '示例关卡', '待导入正式题库', false)
on conflict (id) do update set title = excluded.title, description = excluded.description;

-- 逐题插入 governance_questions；取得 question id 后再插入三个 governance_question_options。
-- 正确选项仅在此导入文件和数据库中保存，禁止进入前端 TypeScript 配置。
