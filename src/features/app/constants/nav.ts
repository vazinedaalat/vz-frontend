import {
  Bell,
  FileText,
  FolderPlus,
  Home,
  MessageCircle,
  MessagesSquare,
  Percent,
  Sparkles,
} from 'lucide-react'
import type { NavItem } from '../types'

export const APP_NAV: readonly NavItem[] = [
  { label: 'خانه', to: '/app', icon: Home, end: true },
  { label: 'مشاوره', to: '/app/consultation', icon: MessagesSquare },
  { label: 'پرونده‌ها', to: '/app/cases', icon: FolderPlus },
  { label: 'اسناد', to: '/app/documents', icon: FileText },
  { label: 'پیام‌ها', to: '/app/chat', icon: MessageCircle },
  { label: 'اطلاعیه‌ها', to: '/app/notifications', icon: Bell },
  { label: 'تخفیف‌ها', to: '/app/discounts', icon: Percent },
  { label: 'پیشنهادها', to: '/app/offers', icon: Sparkles },
] as const

export const DOCUMENT_TYPE_OPTIONS = [
  { value: 'petition', label: 'دادخواست' },
  { value: 'declaration', label: 'اظهارنامه' },
  { value: 'complaint', label: 'شکواییه' },
  { value: 'brief', label: 'لایحه' },
  { value: 'power-of-attorney', label: 'درخواست وکالتنامه / معرفی وکیل' },
] as const

export const CASE_CATEGORY_OPTIONS = ['ملکی', 'خانواده', 'تجاری', 'کیفری', 'سایر'] as const
