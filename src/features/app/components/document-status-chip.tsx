import { cn } from '@/lib/utils'
import { documentStatusChipClass, documentStatusLabel } from '../lib/document-status'

export function DocumentStatusChip({
  status,
  className,
}: {
  status: string | undefined
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-lg px-2.5 py-1 text-[0.7rem] font-semibold tracking-tight',
        documentStatusChipClass(status),
        className,
      )}
    >
      {documentStatusLabel(status)}
    </span>
  )
}
