<script setup lang="ts">
defineProps<{
  items: Array<{ label: string; to?: string }>
}>()
</script>

<template>
  <nav aria-label="Хлебные крошки">
    <ol class="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
      <li v-for="(item, index) in items" :key="index" class="flex items-center gap-1.5">
        <span v-if="index > 0" aria-hidden="true" class="text-slate-300 dark:text-slate-600">/</span>
        <NuxtLink
          v-if="item.to"
          :to="item.to"
          class="hover:text-brand-600 dark:hover:text-brand-400"
        >
          {{ item.label }}
        </NuxtLink>
        <span v-else class="text-slate-700 dark:text-slate-300">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
