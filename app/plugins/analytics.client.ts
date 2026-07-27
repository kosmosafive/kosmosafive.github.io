import { nextTick } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
    if (import.meta.dev || !import.meta.client) return

    const ymId = '111057313'
    const gaId = 'G-0G42DRV94R'

    window.ym = window.ym || function () {
        (window.ym.a = window.ym.a || []).push(arguments)
    }
    window.ym.l = 1 * new Date()

    const ymScript = document.createElement('script')
    ymScript.async = true
    ymScript.src = `https://mc.yandex.ru/metrika/tag.js?id=${ymId}`
    document.head.appendChild(ymScript)

    window.ym(ymId, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
    })

    const gaScript = document.createElement('script')
    gaScript.async = true
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(gaScript)

    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
        window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', gaId)

    nuxtApp.hook('page:transition:finish', () => {
        nextTick(() => {
            const router = nuxtApp.$router
            const path = router ? router.currentRoute.value.fullPath : window.location.pathname

            if (typeof window.ym === 'function') {
                window.ym(ymId, 'hit', path)
            }

            if (typeof window.gtag === 'function') {
                window.gtag('config', gaId, { page_path: path })
            }
        })
    })
})

declare global {
    interface Window {
        ym: any
        dataLayer: any[]
        gtag: (...args: any[]) => void
    }
}
