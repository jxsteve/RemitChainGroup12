import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Navigation, Clock, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/cn'

interface NavItem {
  label: string
  icon: LucideIcon
  to: string
  /** Routes that should render this tab in its active state. */
  matches: string[]
}

const ITEMS: NavItem[] = [
  { label: 'Home', icon: Home, to: '/', matches: ['/'] },
  { label: 'Send', icon: Navigation, to: '/send', matches: ['/send'] },
  {
    label: 'Activity',
    icon: Clock,
    to: '/amount',
    matches: ['/amount', '/review'],
  },
  { label: 'Profile', icon: User, to: '/profile', matches: ['/profile'] },
]

/** Persistent bottom tab bar matching the design's four destinations. */
export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="border-t border-gray-200 bg-canvas px-4 pb-5 pt-3">
      <ul className="flex items-stretch justify-between">
        {ITEMS.map(({ label, icon: Icon, to, matches }) => {
          const active = matches.includes(pathname)
          return (
            <li key={label} className="flex-1">
              <button
                type="button"
                onClick={() => navigate(to)}
                className={cn(
                  'mx-auto flex w-full flex-col items-center gap-1 pt-2 transition-colors',
                  active ? 'text-navy' : 'text-gray-400',
                )}
              >
                <span
                  className={cn(
                    'h-[2px] w-9 rounded-full',
                    active ? 'bg-gray-700' : 'bg-gray-300',
                  )}
                />
                <Icon className="h-5 w-5" strokeWidth={2} />
                <span className="text-xs font-semibold">{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
