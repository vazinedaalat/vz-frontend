import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRoute } from './protected-route'

// Lazy load pages - keep pages minimal for infrastructure
const HomePage = lazy(() => import('@/features/home/pages/home-page'))
const NotFoundPage = lazy(() => import('@/features/home/pages/not-found-page'))

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

// Simple auth check placeholder - replace with real auth when needed
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
