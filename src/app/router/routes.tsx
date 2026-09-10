import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRoute } from './protected-route'

const HomePage = lazy(() => import('@/features/home/pages/home-page'))
const LoginPage = lazy(() => import('@/features/home/pages/login-page'))
const NotFoundPage = lazy(() => import('@/features/home/pages/not-found-page'))

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

const isAuthenticated = false

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <HomePage />
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
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <Suspense fallback={<PageLoader />}>
          <div className="p-8">Protected area - add your features here</div>
        </Suspense>
      </ProtectedRoute>
    ),
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
