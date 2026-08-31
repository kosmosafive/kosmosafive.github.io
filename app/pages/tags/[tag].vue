<script setup lang="ts">
const route = useRoute()
const tag = route.params.tag as string

const { data: posts } = await useAsyncData(`tag-${tag}`, () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .where('tags', 'LIKE', `%"${tag}"%`)
    .order('date', 'DESC')
    .all()
)

useSeoMeta({
  title: `Статьи по тегу #${tag} — dev/blog`,
  description: `Все статьи с тегом ${tag}.`
})
</script>

<template>
  <div>
    <NuxtLink to="/" class="text-sm text-brand-600 hover:underline dark:text-brand-400">
      &larr; Все статьи
    </NuxtLink>

    <h1 class="mt-4 mb-8 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
      Тег: <span class="text-brand-600 dark:text-brand-400">#{{ tag }}</span>
    </h1>

    <div v-if="posts?.length">
      <PostCard v-for="post in posts" :key="post.path" :post="post" />
    </div>
    <p v-else class="text-slate-500">По этому тегу пока нет статей.</p>
  </div>
</template>
