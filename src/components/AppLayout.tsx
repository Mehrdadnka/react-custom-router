// src/components/AppLayout.tsx
import { useState, useEffect, type ReactNode } from 'react'
import { Link } from '@/router/core/Link'
import { CheckCircle, ChevronLeft, Clock1, Home } from 'lucide-react'
import { useRouterStore } from '@/store/router.store'
import './AppLayout.style.css'

// ----- Navigation Item Type -----
interface NavItem {
  to: string
  label: string
  icon: ReactNode
  exact?: boolean
}

const sidebarNavItems: NavItem[] = [
  { to: '/', label: 'Home', icon: <Home size={18} />, exact: true },
  { to: '/about', label: 'About', icon: <CheckCircle size={18} />, exact: true },
]

// ----- Clock Component -----
function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="clock-container">
      <Clock1 className="clock-icon" size={18} />
      <div className="clock-info">
        <span className="clock-time">{formattedTime}</span>
        <span className="clock-date">{formattedDate}</span>
      </div>
    </div>
  )
}

// ----- Breadcrumb Component -----
function Breadcrumb() {
  const pathname = useRouterStore((s) => s.pathname)
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/" className="breadcrumb-link">Home</Link>
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1
        const fullPath = '/' + segments.slice(0, index + 1).join('/')

        return (
          <span key={fullPath} className="breadcrumb-segment">
            <ChevronLeft className="breadcrumb-separator" size={14} />
            {isLast ? (
              <span className="breadcrumb-current">{segment}</span>
            ) : (
              <Link to={fullPath} className="breadcrumb-link">
                {segment}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

// ----- Wrapper component for sidebar links -----
function SidebarLink({ item, isActive, isCollapsed }: { 
  item: NavItem
  isActive: boolean
  isCollapsed: boolean 
}) {
  return (
    <Link
      to={item.to}
      className={`sidebar-link ${isActive ? 'active' : ''}`}
    >
      <span className="sidebar-link-icon">{item.icon}</span>
      {!isCollapsed && (
        <span className="sidebar-link-label">{item.label}</span>
      )}
      {isActive && <span className="active-indicator" />}
    </Link>
  )
}

function Sidebar({
  isCollapsed,
  onToggle,
  pathname,
}: {
  isCollapsed: boolean
  onToggle: () => void
  pathname: string
}) {
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && <h2 className="sidebar-brand">MiniRouter</h2>}
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className={`toggle-icon ${isCollapsed ? 'rotated' : ''}`} size={18} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {sidebarNavItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.to
            : pathname.startsWith(item.to)

          return (
            <SidebarLink
              key={item.to}
              item={item}
              isActive={isActive}
              isCollapsed={isCollapsed}
            />
          )
        })}
      </nav>

      <div className="sidebar-footer">
        {!isCollapsed && (
          <>
            <Clock />

          </>
        )}
      </div>
    </aside>
  )
}

// ----- Main Layout -----
interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = useRouterStore((s) => s.pathname)
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="app-layout">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)}
        pathname={pathname}
      />

      {/* ---- Main Content ---- */}
      <main className="main-content">
        <header className="content-header">
          <Breadcrumb />
        </header>
        <div className="content-body">
          {children}
        </div>
      </main>
    </div>
  )
}