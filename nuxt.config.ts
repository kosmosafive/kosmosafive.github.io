import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxtjs/sitemap'],
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2026-01-01',
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',,
    head: {
      htmlAttrs: { lang: 'ru' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      script: [
        {
          innerHTML: `
            (function () {
              var stored = localStorage.getItem('theme');
              var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              var isDark = stored ? stored === 'dark' : prefersDark;
              document.documentElement.classList.toggle('dark', isDark);
            })();
          `,
          tagPosition: 'head'
        }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()]
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark'
          },
          langs: [
            'js', 'ts', 'jsx', 'tsx', 'vue', 'html', 'css',
            'php', 'bash', 'json', 'yaml', 'sql', 'python', 'go', 'md', 'xml'
          ]
        }
      }
    }
  },

  site: {
    url: 'https://kosmosafive.github.io/',
    name: 'dev/blog — статьи о веб-разработке'
  },
})