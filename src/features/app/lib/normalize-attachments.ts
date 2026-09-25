import { normalizeFileName } from './filename'
import type { CaseChatThread, CaseFileMeta, ChatMessage, SupportTicket } from '../types'

export function normalizeCaseFileMeta(file: CaseFileMeta): CaseFileMeta {
  return {
    ...file,
    name: normalizeFileName(file.name),
  }
}

export function normalizeChatMessage(message: ChatMessage): ChatMessage {
  if (!message.attachments?.length) return message
  return {
    ...message,
    attachments: message.attachments.map(normalizeCaseFileMeta),
  }
}

export function normalizeCaseChatThread(thread: CaseChatThread): CaseChatThread {
  return {
    ...thread,
    messages: thread.messages.map(normalizeChatMessage),
  }
}

export function normalizeSupportTicket(ticket: SupportTicket): SupportTicket {
  return {
    ...ticket,
    messages: ticket.messages.map(normalizeChatMessage),
  }
}
