import type { CaseStage, CaseStatus, LegalCase } from '../types'

/** Ordered client-panel statuses — index aligns with default Nest case stages. */
export const CASE_STATUS_ORDER = [
  'intake',
  'consultation',
  'formed',
  'in-review',
  'follow-up',
  'notified',
  'closed',
] as const satisfies readonly CaseStatus[]

const CASE_STATUS_LABEL: Record<CaseStatus, string> = {
  intake: 'پذیرش اولیه',
  consultation: 'مرحله مشاوره',
  formed: 'تشکیل پرونده',
  'in-review': 'در حال بررسی',
  'follow-up': 'پیگیری',
  notified: 'اطلاع‌رسانی',
  closed: 'بسته‌شده',
}

export type CaseStageState = 'done' | 'current' | 'upcoming'

export interface CaseProcessStage extends CaseStage {
  state: CaseStageState
}

/** Maps Nest/API status strings (incl. underscore variants) to UI CaseStatus. */
export function normalizeCaseStatus(status: string | null | undefined): CaseStatus {
  if (!status) return 'intake'
  const normalized = status.trim().replace(/_/g, '-') as CaseStatus
  return (CASE_STATUS_ORDER as readonly string[]).includes(normalized) ? normalized : 'intake'
}

export function caseStatusLabel(status: CaseStatus | string | null | undefined): string {
  const key = normalizeCaseStatus(status)
  return CASE_STATUS_LABEL[key]
}

/** True when API returned a real lawyer name (not the default assignment placeholder). */
export function isLawyerAssigned(lawyerName: string | null | undefined): boolean {
  const name = lawyerName?.trim() ?? ''
  if (!name || name === '—' || name === '-') return false
  return !/تخصیص/.test(name)
}

/**
 * Secondary line on case cards / headers:
 * show assigned lawyer when present, otherwise the API case status label.
 */
export function caseLawyerOrStatusLabel(
  item: Pick<LegalCase, 'lawyerName' | 'statusLabel' | 'status'>,
): string {
  if (isLawyerAssigned(item.lawyerName)) return item.lawyerName.trim()
  return item.statusLabel?.trim() || caseStatusLabel(item.status)
}

/** Next-action copy — never show the generic “awaiting lawyer” placeholder. */
export function caseNextActionLabel(
  item: Pick<LegalCase, 'nextAction' | 'statusLabel' | 'status'>,
): string {
  const action = item.nextAction?.trim() ?? ''
  if (action && !/تخصیص/.test(action)) return action
  return item.statusLabel?.trim() || caseStatusLabel(item.status)
}

/**
 * Index of the active stage for a case status (0..5).
 * `closed` is past the last stage (all complete).
 */
export function caseStatusStageIndex(status: CaseStatus): number {
  const idx = CASE_STATUS_ORDER.indexOf(status)
  return idx < 0 ? 0 : idx
}

/**
 * Aligns stage `completed` flags with case `status` from the API.
 * Admin may update status without touching stages — UI should still reflect progress.
 */
export function reconcileCaseStages(
  stages: CaseStage[] | null | undefined,
  status: CaseStatus | string | null | undefined,
): CaseProcessStage[] {
  const list = Array.isArray(stages) ? stages : []
  const resolved = normalizeCaseStatus(status)
  const statusIdx = caseStatusStageIndex(resolved)

  const withCompleted = list.map((stage, index) => ({
    ...stage,
    completed: resolved === 'closed' || Boolean(stage.completed) || index < statusIdx,
  }))

  const currentIndex =
    resolved === 'closed' ? -1 : withCompleted.findIndex((stage) => !stage.completed)

  return withCompleted.map((stage, index) => ({
    ...stage,
    state: stage.completed ? 'done' : index === currentIndex ? 'current' : 'upcoming',
  }))
}

/** Prefer the stronger of API progress and stage completion ratio (0–100). */
export function caseProcessProgress(
  apiProgress: number | null | undefined,
  stages: Array<Pick<CaseStage, 'completed'>>,
): number {
  const fromApi = Number.isFinite(Number(apiProgress)) ? Number(apiProgress) : 0
  if (stages.length === 0) return Math.max(0, Math.min(100, fromApi))
  const done = stages.filter((stage) => stage.completed).length
  const fromStages = Math.round((done / stages.length) * 100)
  return Math.max(0, Math.min(100, Math.max(fromApi, fromStages)))
}

export function normalizeLegalCase(
  item: Omit<LegalCase, 'status' | 'statusLabel' | 'progress' | 'lawyerName' | 'nextAction' | 'chatId' | 'stages'> & {
    status: string
    statusLabel?: string | null
    progress?: number | null
    lawyerName?: string | null
    nextAction?: string | null
    chatId?: string | null
    stages?: CaseStage[] | null
  },
): LegalCase {
  const status = normalizeCaseStatus(item.status)
  const processStages = reconcileCaseStages(item.stages, status)
  const stages: CaseStage[] = processStages.map(({ id, title, description, completed, at }) => ({
    id,
    title,
    description,
    completed,
    ...(at ? { at } : {}),
  }))

  return {
    ...item,
    status,
    statusLabel: item.statusLabel?.trim() || caseStatusLabel(status),
    progress: caseProcessProgress(item.progress, processStages),
    lawyerName: item.lawyerName?.trim() || '',
    nextAction: item.nextAction ?? '',
    chatId: item.chatId ?? '',
    stages,
    updatedAt: item.updatedAt ?? '',
  }
}
