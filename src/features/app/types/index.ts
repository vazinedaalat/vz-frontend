import type { LucideIcon } from 'lucide-react'

export type CaseStatus =
  | 'intake'
  | 'consultation'
  | 'formed'
  | 'in-review'
  | 'follow-up'
  | 'notified'
  | 'closed'

export type ConsultationMode = 'video' | 'voice' | 'chat' | 'in-person'

/** Four client-panel consultation products. */
export type ConsultationPlanId =
  | 'free-online'
  | 'specialist-online'
  | 'in-person'
  | 'dargahi-premium'

export type ConsultationChannel = 'online' | 'in-person'

export type DocumentRequestType =
  | 'petition'
  | 'declaration'
  | 'complaint'
  | 'brief'
  | 'power-of-attorney'

export type TicketStatus = 'open' | 'pending' | 'answered' | 'closed'

export interface AppUser {
  id: string
  fullName: string
  phone: string
  nationalIdMasked: string
}

export interface SpecialOffer {
  id: string
  title: string
  subtitle: string
  discountPercent: number
  badge: string
  expiresAt: string
  ctaLabel: string
  href: string
}

export interface DiscountCode {
  id: string
  code: string
  title: string
  description: string
  percent: number
  maxUsage: number
  usedCount: number
  expiresAt: string
  applicableTo: string
  isActive: boolean
}

export interface CaseStage {
  id: string
  title: string
  description: string
  completed: boolean
  at?: string
}

export interface LegalCase {
  id: string
  title: string
  caseNumber: string
  category: string
  status: CaseStatus
  statusLabel: string
  progress: number
  lawyerName: string
  updatedAt: string
  nextAction: string
  stages: CaseStage[]
}

export interface ConsultationPlan {
  id: ConsultationPlanId
  title: string
  subtitle: string
  channel: ConsultationChannel
  channelLabel: string
  /** Online plans: day only. In-person plans: day + time. */
  requiresTime: boolean
  isFree: boolean
  requiresPayment: boolean
  price: number
  durationMinutes: number
  lawyerName: string
  highlights: string[]
  badge?: string
}

export interface ConsultationAvailability {
  /** Fully reserved calendar days (`YYYY-MM-DD`) — not bookable. */
  bookedDates: string[]
  /** Reserved in-person slots as `YYYY-MM-DDTHH:mm`. */
  bookedSlots: string[]
  /** Bookable clock times for in-person plans (`HH:mm`). */
  timeSlots: string[]
}

export interface ConsultationSlot {
  id: string
  topic: string
  planId?: ConsultationPlanId
  mode: ConsultationMode
  modeLabel: string
  lawyerName: string
  startsAt: string
  durationMinutes: number
  price: number
  discountedPrice?: number
  status: 'available' | 'booked' | 'done'
}

export interface BlogCard {
  id: string
  title: string
  excerpt: string
  category: string
  readMinutes: number
  publishedAt: string
}

export interface CaseNotification {
  id: string
  caseId: string
  caseTitle: string
  title: string
  body: string
  createdAt: string
  read: boolean
  kind: 'status' | 'document' | 'hearing' | 'message'
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'admin' | 'system'
  body: string
  createdAt: string
}

export interface SupportTicket {
  id: string
  subject: string
  category: string
  status: TicketStatus
  statusLabel: string
  updatedAt: string
  messages: ChatMessage[]
}

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
}
