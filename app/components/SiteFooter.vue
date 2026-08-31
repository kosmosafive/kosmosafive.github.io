<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-slate-200 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
    <div class="mx-auto flex max-w-3xl flex-col items-center gap-2 px-4 sm:flex-row sm:justify-between sm:px-6">
      <p>&copy; {{ year }} dev/blog</p>
      <div class="flex gap-4">
        <a href="/feed.xml" class="hover:text-brand-600 dark:hover:text-brand-400">RSS</a>
        <a href="https://github.com/kosmosafive" target="_blank" rel="noopener" class="hover:text-brand-600 dark:hover:text-brand-400">GitHub</a>
      </div>
    </div>
  </footer>
</template>
