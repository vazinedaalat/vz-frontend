import { describe, expect, it } from 'vitest'
import { assetUrl } from '@/lib/asset-url'
import { isImageAttachment, resolveAttachmentUrl } from '@/features/app/lib/chat-attachments'

describe('chat attachments', () => {
  it('detects image mime and extensions', () => {
    expect(isImageAttachment({ type: 'image/jpeg', name: 'a.bin' })).toBe(true)
    expect(isImageAttachment({ type: 'application/pdf', name: 'scan.png' })).toBe(true)
    expect(isImageAttachment({ type: 'application/pdf', name: 'doc.pdf' })).toBe(false)
  })

  it('resolves Nest upload paths via asset base', () => {
    expect(resolveAttachmentUrl({ id: '1', name: 'a.jpg', size: 1, type: 'image/jpeg', url: '/uploads/a.jpg' })).toBe(
      assetUrl('/uploads/a.jpg'),
    )
    expect(
      resolveAttachmentUrl({
        id: '2',
        name: 'b.jpg',
        size: 1,
        type: 'image/jpeg',
        url: 'https://cdn.example/b.jpg',
      }),
    ).toBe('https://cdn.example/b.jpg')
    expect(resolveAttachmentUrl({ id: '3', name: 'c.pdf', size: 1, type: 'application/pdf' })).toBe('')
  })
})
