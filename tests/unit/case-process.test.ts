import { describe, expect, it } from 'vitest'
import {
  caseProcessProgress,
  normalizeCaseStatus,
  normalizeLegalCase,
  reconcileCaseStages,
} from '@/features/app/lib/case-process'
import type { CaseStage } from '@/features/app/types'

const baseStages: CaseStage[] = [
  { id: '1', title: 'پذیرش', description: 'a', completed: true, at: '2026-09-19' },
  { id: '2', title: 'مشاوره', description: 'b', completed: false },
  { id: '3', title: 'تشکیل پرونده', description: 'c', completed: false },
  { id: '4', title: 'بررسی و تنظیم', description: 'd', completed: false },
  { id: '5', title: 'پیگیری', description: 'e', completed: false },
  { id: '6', title: 'اطلاع‌رسانی', description: 'f', completed: false },
]

describe('case-process', () => {
  it('normalizes underscore API statuses', () => {
    expect(normalizeCaseStatus('in_review')).toBe('in-review')
    expect(normalizeCaseStatus('follow-up')).toBe('follow-up')
    expect(normalizeCaseStatus('unknown')).toBe('intake')
  })

  it('reconciles stages when admin status is ahead of stage flags', () => {
    const stages = reconcileCaseStages(baseStages, 'follow-up')
    expect(stages.filter((s) => s.completed)).toHaveLength(4)
    expect(stages[4]?.state).toBe('current')
    expect(stages[5]?.state).toBe('upcoming')
  })

  it('marks all stages done when closed', () => {
    const stages = reconcileCaseStages(baseStages, 'closed')
    expect(stages.every((s) => s.completed && s.state === 'done')).toBe(true)
  })

  it('uses the stronger of API progress and stage ratio', () => {
    const stages = reconcileCaseStages(baseStages, 'follow-up')
    expect(caseProcessProgress(10, stages)).toBe(67)
    expect(caseProcessProgress(85, stages)).toBe(85)
  })

  it('normalizes a raw case payload safely', () => {
    const raw = {
      id: 'c1',
      title: 't',
      caseNumber: 'VZ-1',
      category: 'کیفری',
      status: 'follow_up',
      statusLabel: '',
      progress: 10,
      lawyerName: null,
      updatedAt: '2026-09-19T15:41:55.917Z',
      nextAction: null,
      stages: baseStages,
      chatId: null,
    }
    const normalized = normalizeLegalCase(raw)
    expect(normalized.status).toBe('follow-up')
    expect(normalized.statusLabel).toBe('پیگیری')
    expect(normalized.lawyerName).toBe('در انتظار تخصیص')
    expect(normalized.progress).toBe(67)
    expect(normalized.stages.filter((s) => s.completed)).toHaveLength(4)
    expect(normalized.nextAction).toBe('')
    expect(normalized.chatId).toBe('')
  })
})
