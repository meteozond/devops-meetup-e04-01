import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return darkQuery.matches ? 'dark' : 'light'
}

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [explicit, setExplicit] = useState(
    () => localStorage.getItem(STORAGE_KEY) !== null,
  )

  // Follow OS changes until the user picks a theme themselves.
  useEffect(() => {
    if (explicit) return
    const onChange = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? 'dark' : 'light')
    darkQuery.addEventListener('change', onChange)
    return () => darkQuery.removeEventListener('change', onChange)
  }, [explicit])

  useEffect(() => {
    if (explicit) {
      document.documentElement.dataset.theme = theme
      localStorage.setItem(STORAGE_KEY, theme)
    }
  }, [theme, explicit])

  const next: Theme = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Switch to ${next === 'dark' ? 'night' : 'day'} theme`}
      title={`Switch to ${next === 'dark' ? 'night' : 'day'} theme`}
      onClick={() => {
        setExplicit(true)
        setTheme(next)
      }}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
      {theme === 'dark' ? 'Day' : 'Night'}
    </button>
  )
}

export default ThemeToggle
