<script setup lang="ts">
// The inline script in nuxt.config.ts already sets the .dark class on
// <html> before paint, so we just mirror its current state here.
const isDark = ref(false)

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
</script>

<template>
  <header class="border-b border-slate-200 dark:border-slate-800">
    <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
      <NuxtLink to="/" class="text-lg font-semibold tracking-tight">
        dev<span class="text-brand-600 dark:text-brand-400">/</span>blog
      </NuxtLink>

      <nav class="flex items-center gap-5 text-sm">
        <NuxtLink to="/" class="hover:text-brand-600 dark:hover:text-brand-400">Статьи</NuxtLink>
        <NuxtLink to="/about" class="hover:text-brand-600 dark:hover:text-brand-400">Обо мне</NuxtLink>
        <button
          type="button"
          aria-label="Переключить тему"
          class="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
          @click="toggleDark"
        >
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
            <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          </svg>
        </button>
      </nav>
    </div>
  </header>
</template>
