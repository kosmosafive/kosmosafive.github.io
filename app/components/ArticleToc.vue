<script setup lang="ts">
import type { Toc, TocLink } from '@nuxtjs/mdc'

const props = defineProps<{
  toc: Toc
}>()

const MIN_LINKS = 3

const showToc = computed(() => (props.toc?.links?.length ?? 0) >= MIN_LINKS)
const activeId = ref('')
const mobileOpen = ref(false)

function flattenLinks(links: TocLink[]): TocLink[] {
  return links.flatMap(link => [link, ...(link.children ? flattenLinks(link.children) : [])])
}

function updateActiveHeading() {
  const ids = flattenLinks(props.toc.links).map(link => link.id)
  const headings = ids
    .map(id => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null)

  if (!headings.length) return

  const offset = 96
  let current = headings[0].id

  for (const heading of headings) {
    if (heading.getBoundingClientRect().top <= offset) {
      current = heading.id
    }
  }

  activeId.value = current
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  mobileOpen.value = false
}

onMounted(() => {
  if (!showToc.value) return
  updateActiveHeading()
  window.addEventListener('scroll', updateActiveHeading, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveHeading)
})
</script>

<template>
  <template v-if="showToc">
    <!-- Mobile toggle -->
    <button
      type="button"
      class="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-lg xl:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      aria-label="Открыть содержание"
      @click="mobileOpen = true"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
        <path d="M4 6h16M4 12h16M4 18h10" />
      </svg>
      Содержание
    </button>

    <!-- Mobile drawer -->
    <Teleport to="body">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-50 xl:hidden"
        @click.self="mobileOpen = false"
      >
        <div class="absolute inset-0 bg-black/40" />
        <aside
          class="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"
          role="dialog"
          aria-label="Содержание статьи"
        >
          <div class="mb-4 flex items-center justify-between">
            <p class="text-sm font-semibold text-slate-900 dark:text-white">Содержание</p>
            <button
              type="button"
              class="rounded-md p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              aria-label="Закрыть"
              @click="mobileOpen = false"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ArticleTocLinks
            :links="toc.links"
            :active-id="activeId"
            @navigate="scrollTo"
          />
        </aside>
      </div>
    </Teleport>

    <!-- Desktop sticky sidebar -->
    <aside class="hidden xl:block">
      <nav
        class="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto"
        aria-label="Содержание статьи"
      >
        <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Содержание
        </p>
        <ArticleTocLinks
          :links="toc.links"
          :active-id="activeId"
          @navigate="scrollTo"
        />
      </nav>
    </aside>
  </template>
</template>
