<script setup lang="ts">
useSeoMeta({
  title: 'Обо мне — dev/blog',
  description: 'Немного о том, кто пишет этот блог.'
})

const profile = {
  name: 'Siarhei Buinevich',
  role: 'Web developer',
  avatar: 'https://avatars.githubusercontent.com/u/14090839',
  bio: 'Более 10 лет в backend-разработке: от интернет-магазинов и корпоративных порталов до микросервисов, интегрированных с SAP, CRM и внешними API промышленных и логистических компаний.'
}

const socials = [
  {
    name: 'GitHub',
    href: 'https://github.com/kosmosafive',
    icon: 'M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.46-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05a9.3 9.3 0 0 1 2.5-.35c.85 0 1.71.12 2.5.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z'
  },
  {
    name: 'Telegram',
    href: 'https://t.me/kosmosafive',
    icon: 'M21.9 4.6 18.6 20c-.2 1-1.3 1.4-2.1.8l-4.6-3.4-2.3 2.2c-.3.3-.5.4-.9.4l.3-4.6 8.4-7.6c.4-.3-.1-.5-.5-.2L6.5 13 2 11.6c-1-.3-1-1 .2-1.4L20.5 3.5c.8-.3 1.6.2 1.4 1.1Z'
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/siarhei-bunevich/',
    icon: 'M20.47,2H3.53A1.45,1.45,0,0,0,2.06,3.43V20.57A1.45,1.45,0,0,0,3.53,22H20.47a1.45,1.45,0,0,0,1.47-1.43V3.43A1.45,1.45,0,0,0,20.47,2ZM8.09,18.74h-3v-9h3ZM6.59,8.48h0a1.56,1.56,0,1,1,0-3.12,1.57,1.57,0,1,1,0,3.12ZM18.91,18.74h-3V13.91c0-1.21-.43-2-1.52-2A1.65,1.65,0,0,0,12.85,13a2,2,0,0,0-.1.73v5h-3s0-8.18,0-9h3V11A3,3,0,0,1,15.46,9.5c2,0,3.45,1.29,3.45,4.06Z'
  }
]

const skillGroups = [
  {
    title: 'Backend и архитектура',
    skills: [
      'PHP', 'ООП, SOLID, KISS, YAGNI, DRY', 'Паттерны GoF', 'DDD', 'Event Sourcing',
      'Clean Architecture', 'REST API', 'OpenAPI / Swagger', 'Микросервисы', 'PSR-12, PSR-4'
    ]
  },
  {
    title: 'Фреймворки',
    skills: ['Bitrix Framework', 'Symfony', 'Laravel', 'Slim Framework']
  },
  {
    title: 'Данные и хранилища',
    skills: ['MySQL / MariaDB', 'PostgreSQL', 'ElasticSearch / OpenSearch', 'Manticore Search', 'ChromaDB', 'Qdrant', 'Redis', 'ClickHouse', 'ORM, миграции']
  },
  {
    title: 'Интеграции и messaging',
    skills: ['Apache Kafka', 'RabbitMQ', 'GraphQL, WebSocket', 'OAuth2, JWT', 'Symfony Messenger']
  },
  {
    title: 'DevOps и инфраструктура',
    skills: ['Docker', 'CI/CD', 'Git', 'Nginx', 'Caddy', 'Prometheus, Grafana, Sentry, ELK']
  },
  {
    title: 'Тестирование и качество',
    skills: ['PHPUnit, Pest', 'PHPStan, Rector, PHP CS Fixer', 'Infection (mutation testing)', 'Code Review']
  },
  {
    title: 'Frontend',
    skills: ['Vue, Nuxt', 'TypeScript', 'Tailwind CSS', 'Alpine.js']
  },
  {
    title: 'Управление и процессы',
    skills: ['Tech Lead / управление командой', 'Декомпозиция задач', 'Agile / Scrum', 'Менторство']
  }
]
</script>

<template>
  <div>
    <div class="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
      <img
        :src="profile.avatar"
        :alt="profile.name"
        class="h-28 w-28 flex-none rounded-full border border-slate-200 object-cover dark:border-slate-800"
      >
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {{ profile.name }}
        </h1>
        <p class="mt-1 text-brand-600 dark:text-brand-400">{{ profile.role }}</p>
        <p class="mt-4 max-w-xl text-slate-600 dark:text-slate-400">{{ profile.bio }}</p>

        <div class="mt-5 flex justify-center gap-3 sm:justify-start">
          <a
            v-for="social in socials"
            :key="social.name"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="social.name"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-400 dark:hover:text-brand-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor">
              <path :d="social.icon" />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <div class="mt-12">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Технологии</h2>
      <div class="mt-5 space-y-5">
        <div v-for="group in skillGroups" :key="group.title">
          <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ group.title }}</h3>
          <div class="mt-2 flex flex-wrap gap-2">
            <span
                v-for="skill in group.skills"
                :key="skill"
                class="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700 dark:bg-brand-950 dark:text-brand-300"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="prose prose-slate mt-10 max-w-none dark:prose-invert">

    </div>
  </div>
</template>
