import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'

import Home from '@/pages/Home.jsx'
import Login from '@/pages/Login.jsx'
import Signup from '@/pages/Signup.jsx'
import NotFoundPage from '@/pages/NotFoundPage.jsx'
import BookPage from '@/pages/BookPage.jsx'
import MyShelf from '@/pages/MyShelf.jsx'
import SearchPage from '@/pages/SearchPage.jsx'
import EditProfile from '@/pages/EditProfile.jsx'
import AboutPage from '@/pages/AboutPage.jsx'
import NewsPage from '@/pages/NewsPage.jsx'

import { createBrowserRouter, RouterProvider, Outlet } from 'react-router'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/useAuth'
import ScrollToTop from '@/components/routing/ScrollToTop.jsx'
import ProtectedRoute from '@/components/routing/ProtectedRoute.jsx'
import PublicOnlyRoute from '@/components/routing/PublicOnlyRoute.jsx'

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home/> },
      { path: "/login", element: <PublicOnlyRoute><Login/></PublicOnlyRoute> },
      { path: "/signup", element: <PublicOnlyRoute><Signup/></PublicOnlyRoute> },
      { path: "/book/:id", element: <BookPage/> },
      { path: "/search", element: <SearchPage /> },
      { path: "/shelf", element: <ProtectedRoute><MyShelf /></ProtectedRoute> },
      { path: "/profile/edit", element: <ProtectedRoute><EditProfile /></ProtectedRoute> },
      { path: "/news", element: <NewsPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "*", element: <NotFoundPage/> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </AuthProvider>
  </StrictMode>,
)
