<script setup lang="ts">
import { COVER_HEIGHT, COVER_WIDTH } from '~/utils/site'

defineProps<{
  priority?: boolean
  post: {
    path: string
    title: string
    description: string
    date: string
    category?: string
    tags?: string[]
    cover?: string
  }
}>()

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="group border-b border-slate-100 py-6 dark:border-slate-800">
    <div class="flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
      <time>{{ formatDate(post.date) }}</time>
      <NuxtLink
        v-if="post.category"
        :to="`/category/${post.category}`"
        class="font-medium text-brand-600 hover:underline dark:text-brand-400"
      >
        {{ post.category }}
      </NuxtLink>
    </div>

    <NuxtLink :to="post.path" class="block">
      <img
        v-if="post.cover"
        :src="post.cover"
        alt=""
        :width="COVER_WIDTH"
        :height="COVER_HEIGHT"
        class="mt-3 w-full rounded-xl border border-slate-200 dark:border-slate-800"
        :fetchpriority="priority ? 'high' : undefined"
        :loading="priority ? undefined : 'lazy'"
        decoding="async"
      >
      <h2 class="mt-3 text-xl font-semibold text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
        {{ post.title }}
      </h2>
      <p class="mt-2 text-slate-600 dark:text-slate-400">{{ post.description }}</p>
    </NuxtLink>

    <div v-if="post.tags?.length" class="mt-3 flex flex-wrap gap-2">
      <NuxtLink
        v-for="tag in post.tags"
        :key="tag"
        :to="`/tags/${tag}`"
        class="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 hover:bg-brand-100 dark:bg-brand-950 dark:text-brand-300 dark:hover:bg-brand-900"
      >
        #{{ tag }}
      </NuxtLink>
    </div>
  </div>
</template>
