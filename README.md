# dev/blog

Технический блог на [kosmosafive.github.io](https://kosmosafive.github.io/).

## Стек

- [Nuxt 4](https://nuxt.com/) + [Vue 3](https://vuejs.org/)
- [@nuxt/content](https://content.nuxt.com/) — статьи в Markdown
- [Tailwind CSS 4](https://tailwindcss.com/)
- GitHub Pages + GitHub Actions

## Разработка

```bash
npm install
npm run dev
```

Сайт будет доступен на `http://localhost:3000`.

## Сборка

```bash
npm run generate   # статическая генерация в .output/public
npm run preview    # предпросмотр сборки
```

## Добавление статьи

1. Создайте файл `content/blog/my-article.md`
2. Заполните frontmatter:

```yaml
---
title: "Заголовок"
description: "Краткое описание для SEO и карточки"
date: 2026-08-31
category: "Backend"
tags: ["php", "architecture"]
draft: false
---
```

3. Пишите текст в Markdown. Оглавление генерируется автоматически из заголовков `##` и `###`.
4. Закоммитьте и запушьте в `master` — деплой произойдёт автоматически.

## RSS

Лента доступна по адресу `/feed.xml`.
