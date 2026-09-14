import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, CreditCard, Loader2, Receipt } from 'lucide-react'
import { Button } from '@/components/ui'
import { formatFaNumber, toPersianDigits } from '@/lib/format'
import { isMockEnabled } from '@/config/env'
import type { CasePrepaymentInvoice } from '../types'

interface CasePrepaymentPanelProps {
  waiting: boolean
  invoice: CasePrepaymentInvoice | null
  paying: boolean
  onPay: () => void
}

export function CasePrepaymentPanel({ waiting, invoice, paying, onPay }: CasePrepaymentPanelProps) {
  return (
    <div className="rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-7">
      <AnimatePresence mode="wait">
        {waiting ? (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex flex-col items-center py-10 text-center"
          >
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-300">
              <Loader2 className="size-6 animate-spin" aria-hidden />
            </span>
            <h2 className="font-display mt-5 text-xl font-bold text-navy-900">در انتظار پیش‌فاکتور</h2>
            <p className="mt-2 max-w-md text-sm leading-7 text-navy-600">
              مدارک شما دریافت شد. پس از صدور فاکتور پیش‌پرداخت توسط دفتر، می‌توانید پرداخت کنید تا مراحل
              بعدی پرونده فعال شود.
            </p>
            {!isMockEnabled ? (
              <p className="mt-4 text-xs text-navy-500">در محیط تولید، فاکتور از طریق API اعلام می‌شود.</p>
            ) : (
              <p className="mt-4 text-xs text-navy-500">نسخه آزمایشی: پیش‌فاکتور به‌زودی نمایش داده می‌شود…</p>
            )}
          </motion.div>
        ) : invoice ? (
          <motion.div
            key="invoice"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                <Receipt className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-navy-900">{invoice.title}</h2>
                <p className="mt-1 text-sm leading-7 text-navy-600">{invoice.description}</p>
              </div>
            </div>

            <dl className="grid gap-3 rounded-2xl border border-navy-100 bg-navy-50/60 p-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-navy-500">شماره</dt>
                <dd className="mt-1 font-semibold text-navy-900">{toPersianDigits(invoice.id)}</dd>
              </div>
              <div>
                <dt className="text-navy-500">مهلت پرداخت</dt>
                <dd className="mt-1 font-semibold text-navy-900">{invoice.dueLabel}</dd>
              </div>
            </dl>

            <ul className="space-y-2">
              {invoice.items.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-3 border-b border-navy-100 py-2.5 text-sm last:border-0"
                >
                  <span className="text-navy-600">{item.label}</span>
                  <span className="font-semibold text-navy-900">
                    {formatFaNumber(item.amount)} {invoice.currencyLabel}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 rounded-2xl border border-gold-300 bg-gold-100/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-gold-700">مبلغ قابل پرداخت</p>
                <p className="font-display mt-1 text-2xl font-bold text-navy-900">
                  {formatFaNumber(invoice.amount)}
                  <span className="mr-1 text-sm font-medium text-navy-600">{invoice.currencyLabel}</span>
                </p>
              </div>
              <Button
                type="button"
                variant="accent"
                size="lg"
                className="w-full sm:w-auto"
                disabled={paying}
                onClick={onPay}
              >
                <CreditCard className="size-4" aria-hidden />
                {paying ? 'در حال پرداخت…' : 'پرداخت پیش‌فاکتور'}
              </Button>
            </div>

            <p className="flex items-start gap-2 text-xs leading-6 text-navy-500">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-gold-600" aria-hidden />
              پس از پرداخت موفق، مراحل بررسی مدارک، تخصیص وکیل و پیگیری پرونده فعال می‌شود.
            </p>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center">
            <p className="text-sm text-navy-600">هنوز پیش‌فاکتوری صادر نشده است.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
