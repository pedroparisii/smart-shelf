import Logo from '../assets/logo.png'
import Logo2 from '../assets/logo2.png'
import { Button } from "@/components/ui/button"
import { ThemeToggle } from './ThemeToggle'
import { Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV = [
  { label: "Search", to: "/search" },
  { label: "News",   to: "/news" },
  { label: "About",  to: "/about" },
]

function Header({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const close = () => setOpen(false)

  const account = user ? (
    <Button className="hover:bg-contrast hover:text-white" size="lg" asChild>
      <Link to="/shelf" onClick={close}>My Shelf</Link>
    </Button>
  ) : (
    <>
      <Button size="lg" asChild><Link to="/login" onClick={close}>Login</Link></Button>
      <Button variant="outline" size="lg" asChild><Link to="/signup" onClick={close}>Sign Up</Link></Button>
    </>
  )

  return (
    <>
      <header className="w-full h-20 bg-card flex items-center px-5 md:px-16 justify-between fixed z-50 select-none">
        <Link to="/" onClick={close}>
          <img src={theme === "dark" ? Logo : Logo2} alt="Smart Shelf" draggable="false" className="w-36 md:w-44" />
        </Link>

        <nav className="hidden md:flex gap-2 items-center">
          {NAV.map((n) => (
            <Button key={n.to} variant="link" asChild><Link to={n.to}>{n.label}</Link></Button>
          ))}
          {account}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </nav>

        <div className="flex md:hidden gap-2 items-center">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          {account}
          <Button variant="ghost" size="icon" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <nav className={`fixed top-20 left-0 right-0 bg-card border-b border-border z-40 flex flex-col pb-2 gap-2 md:hidden
        transition-all duration-300 ease-in-out ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
      >
        {NAV.map((n) => (
          <Button key={n.to} variant="link" asChild><Link to={n.to} onClick={close}>{n.label}</Link></Button>
        ))}
      </nav>
    </>
  )
}

export default Header
