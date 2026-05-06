import { useEffect, useState } from 'react'

const THEME_KEY = 'khedmalink-theme'

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(THEME_KEY, theme)
    window.dispatchEvent(new CustomEvent('khedmalink-theme-change', { detail: { theme } }))
  }, [theme])

  const toggleTheme = () => {
    setTheme(current => current === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme }
}
