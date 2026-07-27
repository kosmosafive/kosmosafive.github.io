<script setup lang="ts">
const route = useRoute()
const path = route.path.length > 1 ? route.path.replace(/\/+$/, '') : route.path

const { data: post } = await useAsyncData(`post-${path}`, () =>
    queryCollection('blog').path(path).first()
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Статья не найдена' })
}

const { data: surround } = await useAsyncData(`surround-${path}`, () =>
    queryCollectionItemSurroundings('blog', path, {
      fields: ['title', 'description']
    })
)

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': post.value.title,
        'description': post.value.description,
        'datePublished': post.value.date,
        'dateModified': post.value.updated || post.value.date,
        'image': post.value.image ? `https://kosmosafive.github.io${post.value.image}` : undefined,
        'author': {
          '@type': 'Person',
          'name': 'Siarhei Buinevich',
          'url': 'https://kosmosafive.github.io/'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'kosmosafive.github.io',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://kosmosafive.github.io/favicon.svg'
          }
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': `https://kosmosafive.github.io${path}`
        }
      })
    }
  ]
})
</script>

<template>
  <article v-if="post">
    <NuxtLink to="/" class="text-sm text-brand-600 hover:underline dark:text-brand-400">
      &larr; Все статьи
    </NuxtLink>

    <header class="mt-4 mb-8">
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
      <h1 class="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {{ post.title }}
      </h1>
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
    </header>

    <ContentRenderer :value="post" class="prose prose-slate max-w-none dark:prose-invert" />

    <nav v-if="surround" class="mt-12 grid grid-cols-1 gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2 dark:border-slate-800">
      <NuxtLink
        v-if="surround[0]"
        :to="surround[0].path"
        class="rounded-lg border border-slate-200 p-4 hover:border-brand-400 dark:border-slate-800"
      >
        <span class="text-xs text-slate-400">&larr; Предыдущая</span>
        <p class="mt-1 font-medium">{{ surround[0].title }}</p>
      </NuxtLink>
      <NuxtLink
        v-if="surround[1]"
        :to="surround[1].path"
        class="rounded-lg border border-slate-200 p-4 text-right hover:border-brand-400 dark:border-slate-800 sm:col-start-2"
      >
        <span class="text-xs text-slate-400">Следующая &rarr;</span>
        <p class="mt-1 font-medium">{{ surround[1].title }}</p>
      </NuxtLink>
    </nav>
  </article>
</template>
