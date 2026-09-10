import type { LucideIcon } from 'lucide-react'

/** Core services shown in the quick selector. */
export type ServiceId =
  | 'legal-affairs'
  | 'brief-writing'
  | 'petition'
  | 'consultation'
  | 'contracts'
  | 'case-tracking'

export interface NavLink {
  label: string
  /** In-page anchor, e.g. `#services`. */
  href: string
}

export interface ServiceItem {
  id: ServiceId
  /** Short label used inside the quick-selector pills. */
  label: string
  title: string
  description: string
  icon: LucideIcon
}

export interface PracticeArea {
  /** Matches a `ServiceId` for the six core services, or a standalone key. */
  id: string
  title: string
  description: string
  icon: LucideIcon
}

export interface Stat {
  id: string
  value: number
  suffix?: string
  title: string
  description: string
  icon: LucideIcon
}

export interface TrustPoint {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

export interface TeamMember {
  id: string
  name: string
  initials: string
  role: string
  expertise: string
  experienceYears: number
}

export interface ContactInfo {
  phone: string
  phoneHref: string
  email: string
  address: string
  workingHours: string
}
