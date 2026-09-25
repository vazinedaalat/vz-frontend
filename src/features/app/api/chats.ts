import { apiRequest } from '@/services/api'
import { normalizeCaseChatThread, normalizeChatMessage } from '../lib/normalize-attachments'
import type { CaseChatThread, ChatMessage } from '../types'

export function fetchChats() {
  return apiRequest<CaseChatThread[]>({ method: 'GET', url: '/chats' }).then((rows) =>
    rows.map(normalizeCaseChatThread),
  )
}

export function fetchCaseChat(caseId: string) {
  return apiRequest<CaseChatThread>({ method: 'GET', url: `/cases/${caseId}/chat` }).then(
    normalizeCaseChatThread,
  )
}

export function sendCaseChatMessage(caseId: string, body: string, files: File[] = []) {
  const form = new FormData()
  if (body.trim()) form.append('body', body.trim())
  // Pass explicit UTF-8 filename so multipart headers keep Persian names.
  files.forEach((file) => form.append('files', file, file.name))
  return apiRequest<ChatMessage>({
    method: 'POST',
    url: `/cases/${caseId}/chat/messages`,
    data: form,
  }).then(normalizeChatMessage)
}

export function markChatRead(chatId: string) {
  return apiRequest<{ ok: true }>({
    method: 'POST',
    url: `/chats/${chatId}/read`,
  })
}
