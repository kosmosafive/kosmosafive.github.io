export default defineNuxtPlugin(() => {
    if (process.dev) return

    const ymId = '111057313'

    window.ym = window.ym || function () {
        (window.ym.a = window.ym.a || []).push(arguments)
    }
    window.ym.l = 1 * new Date()

    const ymScript = document.createElement('script')
    ymScript.async = true
    ymScript.src = 'https://yandex.ru'
    document.head.appendChild(ymScript)

    window.ym(ymId, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
    })

    const gaId = 'G-0G42DRV94R'

    const gaScript = document.createElement('script')
    gaScript.async = true
    gaScript.src = `https://googletagmanager.com{gaId}`
    document.head.appendChild(gaScript)

    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
        window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', gaId)

    const router = useRouter()
    router.afterEach((to) => {
        window.ym(ymId, 'hit', to.fullPath)
        window.gtag('config', gaId, { page_path: to.fullPath })
    })
})

declare global {
    interface Window {
        ym: any
        dataLayer: any[]
        gtag: (...args: any[]) => void
    }
}
