import { describe, expect, it } from 'vitest'
import { getCaseChatByCaseId, getCaseChats, getCases } from '@/features/app/mocks/data'
import { USE_MOCK_DATA } from '@/lib/mock'

describe('case follow-up chats', () => {
  it('gives every mock case a dedicated chat thread', () => {
    if (!USE_MOCK_DATA) {
      expect(getCases()).toEqual([])
      expect(getCaseChats()).toEqual([])
      return
    }

    const cases = getCases()
    expect(cases.length).toBeGreaterThan(0)
    for (const item of cases) {
      expect(item.chatId).toBeTruthy()
      const chat = getCaseChatByCaseId(item.id)
      expect(chat?.id).toBe(item.chatId)
      expect(chat?.caseId).toBe(item.id)
      expect(chat?.messages.length).toBeGreaterThan(0)
    }
  })
})
