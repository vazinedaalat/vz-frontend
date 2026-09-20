import { apiRequest } from '@/services/api'
import type { TicketValues } from '../schemas'
import type { CaseFileMeta, ChatMessage, SupportTicket } from '../types'

export function fetchSupportTickets() {
  return apiRequest<SupportTicket[]>({ method: 'GET', url: '/support/tickets' })
}

export function createSupportTicket(payload: TicketValues) {
  return apiRequest<SupportTicket>({
    method: 'POST',
    url: '/support/tickets',
    data: payload,
  })
}

export function sendSupportTicketMessage(
  ticketId: string,
  body: string,
  attachments: CaseFileMeta[] = [],
) {
  const files = attachments
    .map((item) => item.file)
    .filter((file): file is File => Boolean(file))
  const form = new FormData()
  if (body.trim()) form.append('body', body.trim())
  files.forEach((file) => form.append('files', file))
  return apiRequest<SupportTicket>({
    method: 'POST',
    url: `/support/tickets/${ticketId}/messages`,
    data: form,
  })
}
