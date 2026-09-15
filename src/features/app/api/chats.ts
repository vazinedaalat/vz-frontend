import { apiRequest } from '@/services/api'
import type { CaseChatThread, ChatMessage } from '../types'

export function fetchChats() {
  return apiRequest<CaseChatThread[]>({ method: 'GET', url: '/chats' })
}

export function fetchCaseChat(caseId: string) {
  return apiRequest<CaseChatThread>({ method: 'GET', url: `/cases/${caseId}/chat` })
}

export function sendCaseChatMessage(caseId: string, body: string, files: File[] = []) {
  const form = new FormData()
  if (body.trim()) form.append('body', body.trim())
  files.forEach((file) => form.append('files', file))
  return apiRequest<ChatMessage>({
    method: 'POST',
    url: `/cases/${caseId}/chat/messages`,
    data: form,
  })
}

export function markChatRead(chatId: string) {
  return apiRequest<{ ok: true }>({
    method: 'POST',
    url: `/chats/${chatId}/read`,
  })
}
