import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui'
import { toPersianDigits } from '@/lib/format'
import { isMockEnabled } from '@/config/env'
import { AppError } from '@/services/api/errors'
import {
  appKeys,
  fetchCaseById,
  fetchCaseChat,
  markChatRead,
  sendCaseChatMessage,
} from '../api'
import { getCaseById, getCaseChatByCaseId } from '../mocks/data'
import { AppEmptyState } from '../components/app-empty-state'
import { ChatThreadPanel } from '../components/chat-thread-panel'
import { PageHeader } from '../components/page-header'
import { caseStatusLine } from '../lib/case-process'
import type { CaseChatThread, ChatMessage, ChatSendPayload } from '../types'

export default function CaseChatPage() {
  const { caseId = '' } = useParams()
  const queryClient = useQueryClient()

  const {
    data: legalCase,
    isLoading: caseLoading,
  } = useQuery({
    queryKey: appKeys.cases.detail(caseId),
    queryFn: () => (isMockEnabled ? Promise.resolve(getCaseById(caseId)) : fetchCaseById(caseId)),
    enabled: Boolean(caseId),
  })

  const {
    data: thread,
    isLoading: chatLoading,
    error: chatError,
  } = useQuery({
    queryKey: appKeys.chats.byCase(caseId),
    queryFn: () =>
      isMockEnabled ? Promise.resolve(getCaseChatByCaseId(caseId)) : fetchCaseChat(caseId),
    enabled: Boolean(caseId),
  })

  useEffect(() => {
    if (isMockEnabled || !thread?.id) return
    void markChatRead(thread.id)
      .then(async () => {
        await queryClient.invalidateQueries({ queryKey: appKeys.chats.all })
        await queryClient.invalidateQueries({ queryKey: appKeys.chats.byCase(caseId) })
      })
      .catch(() => {
        // non-blocking
      })
  }, [thread?.id, caseId, queryClient])

  const sendMutation = useMutation({
    mutationFn: async ({ body, attachments }: ChatSendPayload) => {
      if (isMockEnabled) {
        const message: ChatMessage = {
          id: `cm-${Date.now()}`,
          sender: 'user',
          body,
          createdAt: 'اکنون',
          attachments: attachments.length > 0 ? attachments : undefined,
        }
        return message
      }
      const files = attachments.map((a) => a.file).filter(Boolean) as File[]
      return sendCaseChatMessage(caseId, body, files)
    },
    onSuccess: async (message) => {
      if (isMockEnabled) {
        queryClient.setQueryData(appKeys.chats.byCase(caseId), (prev: CaseChatThread | undefined) =>
          prev
            ? {
                ...prev,
                updatedAt: 'اکنون',
                unreadCount: 0,
                messages: [...prev.messages, message],
              }
            : prev,
        )
        return
      }
      await queryClient.invalidateQueries({ queryKey: appKeys.chats.byCase(caseId) })
      await queryClient.invalidateQueries({ queryKey: appKeys.chats.all })
    },
  })

  if (caseLoading || chatLoading) {
    return <p className="text-sm text-navy-500">در حال بارگذاری…</p>
  }

  if (!legalCase || !thread || chatError) {
    return (
      <AppEmptyState
        title="چت پرونده در دسترس نیست"
        description={
          chatError instanceof AppError
            ? chatError.message
            : 'برای این پرونده هنوز گفتگوی پیگیری یافت نشد یا در محیط تولید از API بارگذاری می‌شود.'
        }
        action={
          <Button variant="outline" asChild>
            <Link to="/app/cases">بازگشت به پرونده‌ها</Link>
          </Button>
        }
      />
    )
  }

  const onSend = (payload: ChatSendPayload) => {
    sendMutation.mutate(payload)
  }

  return (
    <div className="mx-auto min-w-0 max-w-3xl md:space-y-5">
      <div className="hidden md:block">
        <PageHeader
          eyebrow={toPersianDigits(legalCase.caseNumber)}
          title="چت پیگیری پرونده"
          description={`${legalCase.title} · وضعیت: ${legalCase.statusLabel}`}
          action={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <Link to={`/app/cases/${legalCase.id}`}>
                  <FolderOpen className="size-4" aria-hidden />
                  جزئیات پرونده
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/app/chat">همه گفتگوها</Link>
              </Button>
            </div>
          }
        />
      </div>

      <ChatThreadPanel
        immersive
        title={legalCase.title}
        subtitle={`${toPersianDigits(legalCase.caseNumber)} · ${caseStatusLine(legalCase)}`}
        updatedAt={thread.updatedAt}
        messages={thread.messages}
        onSend={onSend}
        className="md:h-[min(70vh,42rem)] md:max-h-[min(70vh,42rem)]"
        headerStart={
          <Button variant="ghost" size="icon" className="mt-0.5 shrink-0 rounded-2xl md:hidden" asChild>
            <Link to={`/app/cases/${legalCase.id}`} aria-label="بازگشت به پرونده">
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        }
      />
    </div>
  )
}
