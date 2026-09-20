import { useCallback, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { isMockEnabled } from '@/config/env'
import { AppError } from '@/services/api/errors'
import { validateDiscountCode } from '../api'
import { normalizeDiscountCode } from '../lib/discount-preview'
import { mockValidateDiscountCode } from '../mocks/data'
import type { DiscountSection, DiscountValidationResult } from '../types'

interface UseDiscountValidationOptions {
  section: DiscountSection | string
  planId?: string
}

/**
 * Validates a discount code via `POST /discounts/validate` for live price preview.
 * Does not consume the code — booking/payment still applies it on submit.
 */
export function useDiscountValidation({ section, planId }: UseDiscountValidationOptions) {
  const [preview, setPreview] = useState<DiscountValidationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [appliedCode, setAppliedCode] = useState<string | null>(null)

  useEffect(() => {
    setPreview(null)
    setError(null)
    setAppliedCode(null)
  }, [section, planId])

  const mutation = useMutation({
    mutationFn: async (code: string) => {
      const normalized = normalizeDiscountCode(code)
      if (isMockEnabled) {
        return mockValidateDiscountCode(normalized, section, planId)
      }
      return validateDiscountCode(normalized, section, planId)
    },
    onSuccess: (result) => {
      setPreview(result)
      setAppliedCode(normalizeDiscountCode(result.code))
      setError(null)
    },
    onError: (err) => {
      setPreview(null)
      setAppliedCode(null)
      setError(err instanceof AppError ? err.message : 'اعتبارسنجی کد تخفیف ناموفق بود')
    },
  })

  const validate = useCallback(
    async (code: string) => {
      const normalized = normalizeDiscountCode(code)
      if (!normalized) {
        setError('کد تخفیف را وارد کنید')
        setPreview(null)
        setAppliedCode(null)
        return null
      }
      if (section === 'consultation' && !planId) {
        setError('ابتدا طرح مشاوره را انتخاب کنید')
        return null
      }
      setError(null)
      return mutation.mutateAsync(normalized)
    },
    [mutation, planId, section],
  )

  const clear = useCallback(() => {
    setPreview(null)
    setError(null)
    setAppliedCode(null)
    mutation.reset()
  }, [mutation])

  /** Drop applied preview when the typed code no longer matches the validated one. */
  const syncWithInput = useCallback(
    (code: string) => {
      const normalized = normalizeDiscountCode(code)
      if (!appliedCode) return
      if (normalized !== appliedCode) {
        setPreview(null)
        setAppliedCode(null)
        setError(null)
      }
    },
    [appliedCode],
  )

  return {
    preview,
    error,
    appliedCode,
    isValidating: mutation.isPending,
    isApplied: Boolean(preview),
    validate,
    clear,
    syncWithInput,
  }
}
