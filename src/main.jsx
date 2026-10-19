import { StrictMode, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import '@/index.css'

import { AuthProvider } from '@/hooks/useAuth'
import RootLayout from '@/components/routing/RootLayout.jsx'
import AuthRoute from '@/components/routing/AuthRoute.jsx'
import Home from '@/pages/Home.jsx'

const Login         = lazy(() => import('@/pages/Login.jsx'))
const Signup        = lazy(() => import('@/pages/Signup.jsx'))
const ResetPassword = lazy(() => import('@/pages/ResetPassword.jsx'))
const BookPage      = lazy(() => import('@/pages/BookPage.jsx'))
const SearchPage    = lazy(() => import('@/pages/SearchPage.jsx'))
const MyShelf       = lazy(() => import('@/pages/MyShelf.jsx'))
const EditProfile   = lazy(() => import('@/pages/EditProfile.jsx'))
const NewsPage      = lazy(() => import('@/pages/NewsPage.jsx'))
const AboutPage     = lazy(() => import('@/pages/AboutPage.jsx'))
const NotFoundPage  = lazy(() => import('@/pages/NotFoundPage.jsx'))

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/book/:id", element: <BookPage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/news", element: <NewsPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/reset-password", element: <ResetPassword /> },
      {
        element: <AuthRoute guestOnly />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/signup", element: <Signup /> },
        ],
      },
      {
        element: <AuthRoute />,
        children: [
          { path: "/shelf", element: <MyShelf /> },
          { path: "/profile/edit", element: <EditProfile /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
