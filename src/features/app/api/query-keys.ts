export const appKeys = {
  all: ['app'] as const,
  home: {
    banners: ['app', 'home', 'banners'] as const,
    blog: ['app', 'home', 'blog'] as const,
  },
  catalog: ['app', 'catalog', 'case-intake'] as const,
  cases: {
    all: ['app', 'cases'] as const,
    detail: (id: string) => ['app', 'cases', id] as const,
    prepayment: (id: string) => ['app', 'cases', id, 'prepayment'] as const,
  },
  chats: {
    all: ['app', 'chats'] as const,
    byCase: (caseId: string) => ['app', 'chats', 'case', caseId] as const,
  },
  consultation: {
    availability: (planId?: string) => ['app', 'consultation', 'availability', planId ?? 'all'] as const,
    bookings: ['app', 'consultation', 'bookings'] as const,
  },
  documents: ['app', 'documents'] as const,
  document: (id: string) => ['app', 'documents', id] as const,
  notifications: ['app', 'notifications'] as const,
  discounts: ['app', 'discounts'] as const,
  support: ['app', 'support', 'tickets'] as const,
}
