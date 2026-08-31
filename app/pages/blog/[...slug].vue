<script setup lang="ts">
import PostComments from '../../components/PostComments.vue'
import { absoluteUrl, DEFAULT_OG_IMAGE } from '~/utils/site'
import { estimateReadingTime, formatReadingTime } from '~/utils/reading-time'

definePageMeta({ layout: 'article' })

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

const toc = computed(() => post.value?.body?.toc)
const readingTime = computed(() =>
  post.value?.body ? formatReadingTime(estimateReadingTime(post.value.body)) : null
)

const ogImage = computed(() =>
  post.value?.cover ? absoluteUrl(post.value.cover) : DEFAULT_OG_IMAGE
)

const canonicalUrl = computed(() => absoluteUrl(path))

const breadcrumbs = computed(() => {
  const items = [{ label: 'Статьи', to: '/' }]
  if (post.value?.category) {
    items.push({ label: post.value.category, to: `/category/${post.value.category}` })
  }
  items.push({ label: post.value!.title })
  return items
})

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogImage: ogImage,
  ogUrl: canonicalUrl,
  twitterCard: 'summary_large_image'
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.value!.title,
        description: post.value!.description,
        datePublished: post.value!.date,
        dateModified: post.value!.updated || post.value!.date,
        image: ogImage.value,
        author: {
          '@type': 'Person',
          name: 'Siarhei Buinevich',
          url: absoluteUrl('/')
        },
        publisher: {
          '@type': 'Organization',
          name: 'kosmosafive.github.io',
          logo: {
            '@type': 'ImageObject',
            url: absoluteUrl('/favicon.svg')
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl.value
        }
      })
    }
  ]
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div v-if="post" class="xl:grid xl:grid-cols-[220px_minmax(0,48rem)] xl:gap-12 xl:justify-center">
    <ArticleToc v-if="toc" :toc="toc" />

    <article class="min-w-0">
      <Breadcrumbs :items="breadcrumbs" />

      <header class="mt-4 mb-8">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-wide text-slate-400">
          <time>{{ formatDate(post.date) }}</time>
          <span v-if="readingTime" aria-hidden="true">&middot;</span>
          <span v-if="readingTime">{{ readingTime }}</span>
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

      <PostComments />
    </article>

    <BackToTop />
  </div>
</template>
