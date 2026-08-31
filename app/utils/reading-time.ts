import type { MarkdownRoot } from '@nuxt/content'

const WORDS_PER_MINUTE = 200

function extractText(node: unknown): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (!Array.isArray(node)) return ''

  const [tag, , ...children] = node
  if (tag === 'text') return String(children[0] ?? '')
  return children.map(extractText).join(' ')
}

export function estimateReadingTime(body: MarkdownRoot): number {
  const root = body as { value?: unknown[] }
  const text = (root.value ?? []).map(extractText).join(' ')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} мин чтения`
}
