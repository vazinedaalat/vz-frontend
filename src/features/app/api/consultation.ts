import { apiRequest } from '@/services/api'
import type {
  ConsultationAvailability,
  ConsultationPlan,
  ConsultationPlanId,
  ConsultationSlot,
} from '../types'
import type { ConsultationRequestValues } from '../schemas'

export type BookingSlot = ConsultationSlot & {
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'waived'
}

export function fetchConsultationPlans() {
  return apiRequest<ConsultationPlan[]>({ method: 'GET', url: '/consultation/plans' })
}

export function fetchConsultationAvailability(params?: {
  planId?: ConsultationPlanId
  from?: string
  to?: string
}) {
  return apiRequest<ConsultationAvailability>({
    method: 'GET',
    url: '/consultation/availability',
    params,
  })
}

export function createConsultationBooking(payload: ConsultationRequestValues) {
  return apiRequest<BookingSlot>({
    method: 'POST',
    url: '/consultation/bookings',
    data: payload,
  })
}

export function fetchConsultationBookings() {
  return apiRequest<BookingSlot[]>({ method: 'GET', url: '/consultation/bookings' })
}

export function payConsultationBooking(id: string) {
  return apiRequest<BookingSlot>({
    method: 'POST',
    url: `/consultation/bookings/${id}/pay`,
  })
}
