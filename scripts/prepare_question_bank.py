"""Convert a user-maintained DOCX single-choice question bank into a Supabase seed file."""

from __future__ import annotations

import argparse
import html
import json
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree


WORD_NAMESPACE = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def sql_quote(value: str) -> str:
    return value.replace("'", "''")


def read_docx_paragraphs(source: Path) -> list[str]:
    with zipfile.ZipFile(source) as archive:
        root = ElementTree.fromstring(archive.read("word/document.xml"))

    paragraphs: list[str] = []
    for paragraph in root.iter(f"{WORD_NAMESPACE}p"):
        text = normalize("".join(node.text or "" for node in paragraph.iter(f"{WORD_NAMESPACE}t")))
        if text:
            paragraphs.append(html.unescape(text))
    return paragraphs


def read_questions(source: Path) -> list[dict[str, object]]:
    section = "综合知识"
    current: dict[str, object] | None = None
    questions: list[dict[str, object]] = []

    for line in read_docx_paragraphs(source):
        if re.match(r"^第[一二三四五六七八九十\d]+组[：:]", line):
            section = line
            continue

        question_match = re.match(r"^(\d{1,2})\.\s*(.+)$", line)
        if question_match:
            if current is not None:
                questions.append(current)
            question_body = question_match.group(2)
            current = {
                "number": int(question_match.group(1)),
                "scenario": section,
                "questionText": normalize(question_body),
                "optionA": "",
                "optionB": "",
                "optionC": "",
                "correctOption": "",
            }

            # Some Word documents place the question, all options, and the answer in one paragraph.
            option_matches = list(re.finditer(r"([ABC])[.．]\s*", question_body))
            answer_match = re.search(r"答案[：:]\s*([ABC])", question_body)
            if len(option_matches) == 3 and [match.group(1) for match in option_matches] == ["A", "B", "C"]:
                current["questionText"] = normalize(question_body[:option_matches[0].start()])
                answer_start = answer_match.start() if answer_match else len(question_body)
                for index, option_match in enumerate(option_matches):
                    option_end = option_matches[index + 1].start() if index < 2 else answer_start
                    current[f"option{option_match.group(1)}"] = normalize(question_body[option_match.end():option_end])
                if answer_match:
                    current["correctOption"] = answer_match.group(1)
            continue

        if current is None:
            continue

        option_match = re.match(r"^([ABC])[.．]\s*(.+)$", line)
        if option_match:
            current[f"option{option_match.group(1)}"] = normalize(option_match.group(2))
            continue

        answer_match = re.match(r"^答案[：:]\s*([ABC])$", line)
        if answer_match:
            current["correctOption"] = answer_match.group(1)

    if current is not None:
        questions.append(current)

    expected_numbers = list(range(1, 41))
    actual_numbers = [question["number"] for question in questions]
    if actual_numbers != expected_numbers:
        raise ValueError(f"题库必须包含连续的 1—40 题，当前解析到：{actual_numbers}")
    required_keys = ("optionA", "optionB", "optionC", "correctOption")
    if any(not all(question[key] for key in required_keys) for question in questions):
        raise ValueError("题库存在缺失的选项或答案，未生成 SQL 文件。")
    return questions


def build_sql(
    questions: list[dict[str, object]],
    level_id: str,
    basin_id: str,
    title: str,
    description: str,
    source_name: str,
) -> str:
    payload = json.dumps(questions, ensure_ascii=False, separators=(",", ":"))
    level_id_sql = sql_quote(level_id)
    basin_id_sql = sql_quote(basin_id)
    title_sql = sql_quote(title)
    description_sql = sql_quote(description)
    return f'''-- Generated from {source_name}. Do not put this answer key in frontend code or Git.
begin;

insert into public.governance_levels (id, basin_id, title, description, is_published)
values ('{level_id_sql}', '{basin_id_sql}', '{title_sql}', '{description_sql}', false)
on conflict (id) do update
set basin_id = excluded.basin_id,
    title = excluded.title,
    description = excluded.description,
    is_published = false;

do $$
declare
  item jsonb;
  question_id uuid;
  payload jsonb := $json${payload}$json$::jsonb;
begin
  if exists (select 1 from public.governance_questions where level_id = '{level_id_sql}') then
    raise exception 'Question bank for {level_id_sql} already exists. Existing answers are preserved.';
  end if;

  for item in select value from jsonb_array_elements(payload)
  loop
    insert into public.governance_questions (level_id, scenario, question_text, explanation)
    values (
      '{level_id_sql}',
      item->>'scenario',
      item->>'questionText',
      format('正确答案：%s。请结合本节点资料理解本题。', item->>'correctOption')
    )
    returning id into question_id;

    insert into public.governance_question_options (question_id, option_order, option_text, is_correct)
    values
      (question_id, 1, item->>'optionA', item->>'correctOption' = 'A'),
      (question_id, 2, item->>'optionB', item->>'correctOption' = 'B'),
      (question_id, 3, item->>'optionC', item->>'correctOption' = 'C');
  end loop;

  if (select count(*) from public.governance_questions where level_id = '{level_id_sql}' and is_active) <> 40 then
    raise exception '{level_id_sql} must have exactly 40 active questions.';
  end if;
  if exists (
    select 1 from public.governance_questions q
    where q.level_id = '{level_id_sql}'
      and (select count(*) from public.governance_question_options o where o.question_id = q.id) <> 3
  ) then
    raise exception '{level_id_sql} contains a question without exactly three options.';
  end if;
  if exists (
    select 1 from public.governance_questions q
    where q.level_id = '{level_id_sql}'
      and (select count(*) from public.governance_question_options o where o.question_id = q.id and o.is_correct) <> 1
  ) then
    raise exception '{level_id_sql} contains a question without exactly one correct option.';
  end if;
end;
$$;

update public.governance_levels set is_published = true where id = '{level_id_sql}';
commit;
'''


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("--level-id", required=True)
    parser.add_argument("--basin-id", required=True, choices=("yellow-river", "yangtze-river"))
    parser.add_argument("--title", required=True)
    parser.add_argument("--description", required=True)
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()

    questions = read_questions(arguments.source)
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(
        build_sql(questions, arguments.level_id, arguments.basin_id, arguments.title, arguments.description, arguments.source.name),
        encoding="utf-8",
    )
    print(f"Generated {arguments.output} with {len(questions)} questions.")
