import { describe, expect, it } from 'vitest'
import { sanitizeBlogHtml } from '@/features/blog/lib/sanitize-blog-html'

describe('sanitizeBlogHtml', () => {
  it('keeps headings and lists, strips scripts', () => {
    const html = sanitizeBlogHtml(
      '<h2>تیتر</h2><p>متن</p><ul><li>۱</li></ul><script>alert(1)</script>',
    )
    expect(html).toContain('<h2>')
    expect(html).toContain('<ul>')
    expect(html).not.toContain('script')
  })
})
