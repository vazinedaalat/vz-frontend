import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, CreditCard, Receipt, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui'
import { formatFaNumber } from '@/lib/format'
import type { DocumentPaymentInfo } from '../types'

type PaymentMode = 'prepayment' | 'final'

interface DocumentPaymentPanelProps {
  mode: PaymentMode
  payment: DocumentPaymentInfo
  claimTitle: string
  paying?: boolean
  onPay: () => void
}

export function DocumentPaymentPanel({
  mode,
  payment,
  claimTitle,
  paying = false,
  onPay,
}: DocumentPaymentPanelProps) {
  const currency = payment.currencyLabel || 'تومان'
  const isPrepay = mode === 'prepayment'
  const amount = isPrepay
    ? payment.prepaymentAmount
    : (payment.remainderAmount ?? Math.max(0, (payment.totalAmount ?? 0) - payment.prepaymentAmount))
  const alreadyPaid = isPrepay
    ? payment.prepaymentStatus === 'paid'
    : payment.finalPaymentStatus === 'paid'

  return (
    <div className="rounded-[1.5rem] border border-navy-200 bg-white p-5 shadow-soft sm:p-7">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode + String(alreadyPaid)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-5"
        >
          <div className="flex items-start gap-3">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
              <Receipt className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gold-700">
                {isPrepay ? 'پیش‌پرداخت ثبت سند' : 'پرداخت مبلغ کل'}
              </p>
              <h2 className="font-display mt-1 text-lg font-bold text-navy-900 sm:text-xl">
                {claimTitle}
              </h2>
              <p className="mt-2 text-sm leading-7 text-navy-600">
                {isPrepay
                  ? 'پس از واریز پیش‌پرداخت، درخواست در صف بررسی ادمین قرار می‌گیرد و مبلغ کل اعلام می‌شود.'
                  : payment.priceDescription ||
                    'مبلغ کل توسط ادمین اعلام شده است. با پرداخت مابه‌التفاوت، مراحل تنظیم سند آغاز می‌شود.'}
              </p>
            </div>
          </div>

          {isPrepay && payment.prepaymentItems && payment.prepaymentItems.length > 0 ? (
            <ul className="space-y-2 rounded-2xl border border-navy-100 bg-navy-50/60 p-4">
              {payment.prepaymentItems.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-3 border-b border-navy-100 py-2 text-sm last:border-0"
                >
                  <span className="text-navy-600">{item.label}</span>
                  <span className="font-semibold text-navy-900">
                    {formatFaNumber(item.amount)} {currency}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {!isPrepay && payment.totalAmount != null ? (
            <dl className="grid gap-3 rounded-2xl border border-navy-100 bg-navy-50/60 p-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-navy-500">مبلغ کل</dt>
                <dd className="mt-1 font-semibold text-navy-900">
                  {formatFaNumber(payment.totalAmount)} {currency}
                </dd>
              </div>
              <div>
                <dt className="text-navy-500">پیش‌پرداخت پرداخت‌شده</dt>
                <dd className="mt-1 font-semibold text-navy-900">
                  {formatFaNumber(payment.prepaymentAmount)} {currency}
                </dd>
              </div>
            </dl>
          ) : null}

          <div className="flex flex-col gap-3 rounded-2xl border border-gold-300 bg-gold-100/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-gold-700">
                {isPrepay ? 'مبلغ پیش‌پرداخت' : 'مبلغ قابل پرداخت (مابه‌التفاوت)'}
              </p>
              <p className="font-display mt-1 text-2xl font-bold text-navy-900">
                {formatFaNumber(amount)}
                <span className="mr-1 text-sm font-medium text-navy-600">{currency}</span>
              </p>
            </div>
            {alreadyPaid ? (
              <span className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-gold-300">
                <ShieldCheck className="size-4" aria-hidden />
                پرداخت شده
              </span>
            ) : (
              <Button
                type="button"
                variant="accent"
                size="lg"
                className="w-full sm:w-auto"
                disabled={paying}
                onClick={onPay}
              >
                <CreditCard className="size-4" aria-hidden />
                {paying ? 'در حال پرداخت…' : isPrepay ? 'پرداخت پیش‌پرداخت' : 'پرداخت مابه‌التفاوت'}
              </Button>
            )}
          </div>

          <p className="flex items-start gap-2 text-xs leading-6 text-navy-500">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-gold-600" aria-hidden />
            {isPrepay
              ? 'پرداخت به‌صورت آزمایشی (stub) ثبت می‌شود تا درگاه بانکی متصل شود.'
              : 'پس از پرداخت موفق، وضعیت به «در حال تنظیم» تغییر می‌کند.'}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
