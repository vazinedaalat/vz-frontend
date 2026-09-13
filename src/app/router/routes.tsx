import { lazy, Suspense } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { ProtectedRoute } from './protected-route'
import { useAuthStore } from '@/features/app/store/auth-store'
import { AppShell } from '@/features/app/components/app-shell'

const MarketingHomePage = lazy(() => import('@/features/home/pages/home-page'))
const LoginPage = lazy(() => import('@/features/home/pages/login-page'))
const NotFoundPage = lazy(() => import('@/features/home/pages/not-found-page'))

const AppHomePage = lazy(() => import('@/features/app/pages/app-home-page'))
const ConsultationPage = lazy(() => import('@/features/app/pages/consultation-page'))
const CasesPage = lazy(() => import('@/features/app/pages/cases-page'))
const CreateCasePage = lazy(() => import('@/features/app/pages/create-case-page'))
const CaseDetailPage = lazy(() => import('@/features/app/pages/case-detail-page'))
const DocumentRequestPage = lazy(() => import('@/features/app/pages/document-request-page'))
const NotificationsPage = lazy(() => import('@/features/app/pages/notifications-page'))
const DiscountsPage = lazy(() => import('@/features/app/pages/discounts-page'))
const OffersPage = lazy(() => import('@/features/app/pages/offers-page'))
const ChatPage = lazy(() => import('@/features/app/pages/chat-page'))

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-navy-50">
      <div
        className="size-10 animate-spin rounded-full border-2 border-gold-500 border-t-transparent"
        aria-label="در حال بارگذاری"
      />
    </div>
  )
}

function AuthGate() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return (
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </ProtectedRoute>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <MarketingHomePage />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/app',
    element: <AuthGate />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <AppHomePage /> },
          { path: 'consultation', element: <ConsultationPage /> },
          { path: 'cases', element: <CasesPage /> },
          { path: 'cases/new', element: <CreateCasePage /> },
          { path: 'cases/:caseId', element: <CaseDetailPage /> },
          { path: 'documents', element: <DocumentRequestPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'discounts', element: <DiscountsPage /> },
          { path: 'offers', element: <OffersPage /> },
          { path: 'chat', element: <ChatPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
