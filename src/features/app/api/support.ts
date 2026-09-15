import { apiRequest } from '@/services/api'
import type { TicketValues } from '../schemas'
import type { ChatMessage, SupportTicket } from '../types'

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

export function sendSupportTicketMessage(ticketId: string, body: string) {
  return apiRequest<ChatMessage>({
    method: 'POST',
    url: `/support/tickets/${ticketId}/messages`,
    data: { body },
  })
}
