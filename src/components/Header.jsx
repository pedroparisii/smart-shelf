import Logo from '../assets/logo.png'
import Logo2 from '../assets/logo2.png'
import { Button } from "@/components/ui/button"
import { ThemeToggle } from './ThemeToggle'
import { useTheme } from "../hooks/useTheme"
import { Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

function Header() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const loggedIn = !!user;

  return (
    <>
      <div className="w-full h-20 bg-card flex items-center px-5 md:px-16 justify-between fixed z-50 select-none">
        <Link to="/">
          <img src={theme === "dark" ? Logo : Logo2} alt="Logo" draggable="false" className="w-36 md:44" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-2 items-center">
          <Button variant='link'><Link to="/search">Search</Link></Button>
          <Button variant='link'><Link to="/news">News</Link></Button>
          <Button variant='link'><Link to="/about">About</Link></Button>
          {loggedIn ? (
            <Button className='hover:bg-[#cf7412] hover:text-white' size='lg'>
              <Link to="/shelf">My Shelf</Link>
            </Button>
          ) : (
            <>
              <Button size='lg' asChild><Link to="/login">Login</Link></Button>
              <Button variant='outline' size='lg' asChild><Link to="/signup">Sign Up</Link></Button>
            </>
          )}
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        {/* Mobile */}
        <div className="flex md:hidden gap-2 items-center">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          {loggedIn ? (
            <Button onClick={() => setOpen(false)} asChild><Link to="/shelf">My Shelf</Link></Button>
          ) : (
            <>
              <Button asChild onClick={() => setOpen(false)}><Link to="/login">Login</Link></Button>
              <Button variant='outline' asChild onClick={() => setOpen(false)}><Link to="/signup">Sign Up</Link></Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={() => setOpen(o => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`fixed top-20 left-0 right-0 bg-card border-b border-border z-40 flex flex-col pb-2 gap-2 md:hidden
        transition-all duration-300 ease-in-out ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
        >
          <Button variant='link' asChild onClick={() => setOpen(false)}><Link to="/search">Search</Link></Button>
          <Button variant='link' asChild onClick={() => setOpen(false)}><Link to="/news">News</Link></Button>
          <Button variant='link' asChild onClick={() => setOpen(false)}><Link to="/about">About</Link></Button>
        </div>

    </>
  )
}

export default Header
