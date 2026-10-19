<script setup lang="ts">
const route = useRoute()
const category = route.params.category as string

const { data: posts } = await useAsyncData(`category-${category}`, () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .where('category', '=', category)
    .order('date', 'DESC')
    .all()
)

useSeoMeta({
  title: `Категория: ${category} — dev/blog`,
  description: `Все статьи в категории ${category}.`
})
</script>

<template>
  <div>
    <NuxtLink to="/" class="text-sm text-brand-600 hover:underline dark:text-brand-400">
      &larr; Все статьи
    </NuxtLink>

    <h1 class="mt-4 mb-8 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
      Категория: <span class="text-brand-600 dark:text-brand-400">{{ category }}</span>
    </h1>

    <div v-if="posts?.length">
      <PostCard
        v-for="(post, index) in posts"
        :key="post.path"
        :post="post"
        :priority="index === 0"
      />
    </div>
    <p v-else class="text-slate-500">В этой категории пока нет статей.</p>
  </div>
</template>
