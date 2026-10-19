<script setup lang="ts">
import { DEFAULT_OG_IMAGE } from '~/utils/site'

const { data: posts } = await useAsyncData('posts-list', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all()
)

const categories = computed(() => {
  const set = new Set((posts.value ?? []).map(p => p.category).filter(Boolean))
  return Array.from(set) as string[]
})

useSeoMeta({
  title: 'dev/blog — статьи о веб-разработке',
  description: 'Технические заметки о фронтенде, бэкенде и инструментах веб-разработчика.',
  ogImage: DEFAULT_OG_IMAGE
})
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Технический блог
      </h1>
      <p class="mt-2 text-slate-600 dark:text-slate-400">
        Заметки о разработке, инструментах и всём, что я узнаю в процессе работы.
      </p>
    </div>

    <div v-if="categories.length" class="mb-8 flex flex-wrap gap-2">
      <NuxtLink
        v-for="category in categories"
        :key="category"
        :to="`/category/${category}`"
        class="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-brand-400"
      >
        {{ category }}
      </NuxtLink>
    </div>

    <div v-if="posts?.length">
      <PostCard
        v-for="(post, index) in posts"
        :key="post.path"
        :post="post"
        :priority="index === 0"
      />
    </div>
    <p v-else class="text-slate-500">Пока здесь пусто — первая статья скоро появится.</p>
  </div>
</template>
