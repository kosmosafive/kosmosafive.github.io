export const SITE_URL = 'https://kosmosafive.github.io'
export const SITE_NAME = 'dev/blog — статьи о веб-разработке'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.svg`

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}
