import { apiRequest } from '@/services/api'
import { normalizeSupportTicket } from '../lib/normalize-attachments'
import type { TicketValues } from '../schemas'
import type { CaseFileMeta, SupportTicket } from '../types'

export function fetchSupportTickets() {
  return apiRequest<SupportTicket[]>({ method: 'GET', url: '/support/tickets' }).then((rows) =>
    rows.map(normalizeSupportTicket),
  )
}

export function createSupportTicket(payload: TicketValues) {
  return apiRequest<SupportTicket>({
    method: 'POST',
    url: '/support/tickets',
    data: payload,
  }).then(normalizeSupportTicket)
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
  files.forEach((file) => form.append('files', file, file.name))
  return apiRequest<SupportTicket>({
    method: 'POST',
    url: `/support/tickets/${ticketId}/messages`,
    data: form,
  }).then(normalizeSupportTicket)
}
