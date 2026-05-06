import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const Icon = isDark ? Sun : Moon

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Passer au theme clair' : 'Passer au theme sombre'}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border
        border-light-border bg-light-surface text-light-text transition-colors
        hover:border-teal hover:text-teal
        dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white"
    >
      <Icon size={15} />
    </button>
  )
}
