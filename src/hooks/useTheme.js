import { useState, useEffect } from "react"

// The initial class is set by an inline script in index.html (no theme flash)
export function useTheme() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains("light") ? "light" : "dark"
  )

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(theme)
    try { localStorage.setItem("theme", theme) } catch { /* storage unavailable */ }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"))

  return { theme, toggleTheme }
}
