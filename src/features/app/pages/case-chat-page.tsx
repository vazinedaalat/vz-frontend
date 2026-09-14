import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui'
import { getCaseById, getCaseChatByCaseId } from '../mocks/data'
import { AppEmptyState } from '../components/app-empty-state'
import { ChatThreadPanel } from '../components/chat-thread-panel'
import { PageHeader } from '../components/page-header'
import type { CaseChatThread, ChatMessage, ChatSendPayload } from '../types'

export default function CaseChatPage() {
  const { caseId = '' } = useParams()
  const legalCase = getCaseById(caseId)
  const initialChat = useMemo(() => getCaseChatByCaseId(caseId), [caseId])
  const [thread, setThread] = useState<CaseChatThread | null>(initialChat ?? null)

  if (!legalCase || !thread) {
    return (
      <AppEmptyState
        title="چت پرونده در دسترس نیست"
        description="برای این پرونده هنوز گفتگوی پیگیری یافت نشد یا در محیط تولید از API بارگذاری می‌شود."
        action={
          <Button variant="outline" asChild>
            <Link to="/app/cases">بازگشت به پرونده‌ها</Link>
          </Button>
        }
      />
    )
  }

  const onSend = ({ body, attachments }: ChatSendPayload) => {
    const message: ChatMessage = {
      id: `cm-${Date.now()}`,
      sender: 'user',
      body,
      createdAt: 'اکنون',
      attachments: attachments.length > 0 ? attachments : undefined,
    }
    setThread((prev) =>
      prev
        ? {
            ...prev,
            updatedAt: 'اکنون',
            unreadCount: 0,
            messages: [...prev.messages, message],
          }
        : prev,
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="hidden md:block">
        <PageHeader
          eyebrow={legalCase.caseNumber}
          title="چت پیگیری پرونده"
          description={`${legalCase.title} · وکیل مسئول: ${legalCase.lawyerName}`}
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
        title={legalCase.title}
        subtitle={`${legalCase.caseNumber} · ${legalCase.lawyerName}`}
        messages={thread.messages}
        onSend={onSend}
        className="min-h-[70vh] md:min-h-[32rem]"
        headerStart={
          <Button variant="ghost" size="icon" className="mt-0.5 shrink-0 md:hidden" asChild>
            <Link to={`/app/cases/${legalCase.id}`} aria-label="بازگشت به پرونده">
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        }
      />
    </div>
  )
}
