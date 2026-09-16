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

function normalizeBooking(item: BookingSlot): BookingSlot {
  return {
    ...item,
    bookingCode: item.bookingCode?.trim() || item.id,
  }
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
  }).then(normalizeBooking)
}

export function fetchConsultationBookings() {
  return apiRequest<BookingSlot[]>({ method: 'GET', url: '/consultation/bookings' }).then((items) =>
    items.map(normalizeBooking),
  )
}

export function payConsultationBooking(id: string) {
  return apiRequest<BookingSlot>({
    method: 'POST',
    url: `/consultation/bookings/${id}/pay`,
  }).then(normalizeBooking)
}
