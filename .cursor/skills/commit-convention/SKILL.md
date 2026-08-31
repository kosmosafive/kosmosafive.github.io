---
name: commit-convention
description: Формирует commit message и завершает feature-ветку (squash) по Conventional Commits из docs/commit_convention.md проекта. Использовать когда пользователь просит сообщение коммита, закоммитить, завершить feature, свернуть коммиты в один или squash ветку.
---

# Commit Convention

## Источник правил

Перед любым действием прочитай `docs/commit_convention.md` в корне текущего проекта. Если файла нет — спроси пользователя о формате.

## Формат сообщения

```text
<тип>(<область>): [<номер-задачи>] <краткое описание>

[необязательное тело]
```

- **Типы:** `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`
- **Область:** модуль-существительное: `(auth)`, `(api)`, `(db)`; для глобальных изменений — опустить
- **Task ID:** из трекера, напр. `[NV-92]` — после двоеточия, не в scope
- Описание в subject — **на английском** (если в проекте не оговорено иное)

## Режим A: Сформировать сообщение коммита

1. `git status` и `git diff` (staged + unstaged)
2. Определи тип, scope, task ID (из ветки, diff или спроси пользователя)
3. Верни **готовую строку subject** и при необходимости тело
4. Не выполняй `git commit`, пока пользователь явно не попросит

**Пример вывода:**

```text
feat(report): [NV-92] add nomination statistics export
```

## Режим B: Завершить feature-ветку (squash)

Использовать когда пользователь просит завершить feature, свернуть коммиты, подготовить ветку к merge.

### Подготовка

1. Прочитай `docs/commit_convention.md`
2. `git status` — рабочее дерево должно быть чистым (или пользователь в курсе незакоммиченного)
3. `git branch --show-current` — текущая feature-ветка
4. Базовая ветка: по умолчанию `develop`; если нет — `main`/`master`; иначе спроси
5. `git log --oneline $(git merge-base HEAD $BASE)..HEAD` — список коммитов для squash
6. `git diff $(git merge-base HEAD $BASE)...HEAD` — полное содержание изменений

### Сообщение squash-коммита

- Один коммит описывает **всю feature**, не отдельные промежуточные шаги
- Тип обычно `feat` или `fix`; scope — главный затронутый модуль
- Task ID — из названия ветки (`feature/NV-92-...`) или спроси

Покажи пользователю draft сообщения и **дождись подтверждения** перед squash.

### Squash (только после явного подтверждения)

```bash
BASE=develop  # заменить на актуальную базу
git reset --soft "$(git merge-base HEAD "$BASE")"
git commit -m "$(cat <<'EOF'
feat(scope): [NV-92] short summary of the feature

Optional body: what and why, not a list of intermediate commits.
EOF
)"
```

### После squash

- Если ветка уже была на remote — предупреди, что для обновления нужен `git push --force-with-lease`, и выполняй **только по явной просьбе**
- Не делай merge в базовую ветку, если пользователь не просил

## Безопасность Git

- Коммит, squash, push — **только по явной просьбе** пользователя
- Не менять `git config`
- Не использовать `--no-verify`, force push, hard reset без явного запроса
- Force push — только `--force-with-lease`, никогда в `main`/`master` без предупреждения

## Примеры запросов пользователя

| Запрос | Режим |
|--------|-------|
| «Как назвать коммит?» | A |
| «Закоммить изменения» | A → commit после подтверждения |
| «Заверши feature, squash» | B |
| «Сверни все коммиты в один» | B |
