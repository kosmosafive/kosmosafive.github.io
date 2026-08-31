<script setup lang="ts">
import type { TocLink } from '@nuxtjs/mdc'

defineProps<{
  links: TocLink[]
  activeId: string
}>()

defineEmits<{
  navigate: [id: string]
}>()
</script>

<template>
  <ul class="space-y-1 text-sm">
    <li v-for="link in links" :key="link.id">
      <button
        type="button"
        class="w-full rounded-md px-2 py-1 text-left transition hover:text-brand-600 dark:hover:text-brand-400"
        :class="[
          link.depth === 3 ? 'pl-4 text-slate-500 dark:text-slate-400' : 'text-slate-600 dark:text-slate-300',
          activeId === link.id ? 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-950 dark:text-brand-300' : ''
        ]"
        @click="$emit('navigate', link.id)"
      >
        {{ link.text }}
      </button>
      <ArticleTocLinks
        v-if="link.children?.length"
        :links="link.children"
        :active-id="activeId"
        class="mt-1"
        @navigate="$emit('navigate', $event)"
      />
    </li>
  </ul>
</template>
