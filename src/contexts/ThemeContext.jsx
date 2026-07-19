import { useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContextValues.jsx'

export function ThemeProvider({ children }) {
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'dark'
    try {
      return localStorage.getItem('hexalaundaryTheme') === 'light' ? 'light' : 'dark'
    } catch {
      return 'dark'
    }
  }

  const [theme, setTheme] = useState(getInitialTheme)

  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme)
  }

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.add('no-transition')
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('hexalaundaryTheme', next)
    } catch {
      // ignore storage errors
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-transition')
      })
    })
  }

  const value = useMemo(() => ({ theme, toggle }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

