import {
  Bell,
  FileText,
  FolderOpen,
  FolderPlus,
  MessageCircle,
  MessagesSquare,
  Percent,
  UserRound,
  type LucideIcon,
} from 'lucide-react'

export interface AppHomeService {
  id: string
  label: string
  to: string
  icon: LucideIcon
}

/** Quick service shortcuts under the home banner (Blubank-style icon grid). */
export const APP_HOME_SERVICES: readonly AppHomeService[] = [
  { id: 'consultation', label: 'مشاوره', to: '/app/consultation', icon: MessagesSquare },
  { id: 'new-case', label: 'پرونده جدید', to: '/app/cases/new', icon: FolderPlus },
  { id: 'cases', label: 'پرونده‌ها', to: '/app/cases', icon: FolderOpen },
  { id: 'documents', label: 'اسناد', to: '/app/documents', icon: FileText },
  { id: 'chat', label: 'پیام‌ها', to: '/app/chat', icon: MessageCircle },
  { id: 'notifications', label: 'اطلاعیه‌ها', to: '/app/notifications', icon: Bell },
  { id: 'discounts', label: 'تخفیف‌ها', to: '/app/discounts', icon: Percent },
  { id: 'profile', label: 'مشخصات من', to: '/app/profile', icon: UserRound },
] as const
