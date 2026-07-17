import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileHeader } from './MobileHeader'
import { MobileNav } from './MobileNav'
import styles from './Layout.module.css'

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileMenuOpen])

  return (
    <div className={styles.layout}>
      <Sidebar />
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className={styles.main}>
        <MobileHeader onMenuToggle={() => setMobileMenuOpen((prev) => !prev)} />
        <Header />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
