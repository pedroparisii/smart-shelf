import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { Toaster } from 'sonner'
import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import PageLoader from '@/components/PageLoader.jsx'
import ScrollToTop from '@/components/routing/ScrollToTop.jsx'
import { ShelfProvider } from '@/hooks/useShelf'
import { useTheme } from '@/hooks/useTheme'

function RootLayout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <ShelfProvider>
      <ScrollToTop />
      <div className="min-h-screen overflow-x-hidden">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
        <Footer />
      </div>
      <Toaster theme={theme} position="bottom-right" richColors />
    </ShelfProvider>
  )
}

export default RootLayout
