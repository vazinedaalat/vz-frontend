import { apiRequest } from '@/services/api'
import type { CaseNotification } from '../types'

export function fetchNotifications() {
  return apiRequest<CaseNotification[]>({ method: 'GET', url: '/notifications' })
}

export function markNotificationRead(id: string) {
  return apiRequest<CaseNotification>({
    method: 'PATCH',
    url: `/notifications/${id}/read`,
  })
}

export function markAllNotificationsRead() {
  return apiRequest<{ ok: true }>({
    method: 'POST',
    url: '/notifications/read-all',
  })
}
