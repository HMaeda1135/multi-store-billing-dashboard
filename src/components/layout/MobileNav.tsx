import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { roleLabels } from '../../lib/labels'
import { adminNavItems, staffNavItems } from './navConfig'
import styles from './MobileNav.module.css'

type MobileNavProps = {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user, isAdmin } = useAuth()
  const navItems = isAdmin ? adminNavItems : staffNavItems

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <nav
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        aria-hidden={!isOpen}
      >
        <div className={styles.header}>
          <div className={styles.logoTitle}>仕入れ・請求管理</div>
          <div className={styles.logoSub}>Multi-Store Billing</div>
        </div>
        <div className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        {user && (
          <div className={styles.footer}>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userRole}>{roleLabels[user.role]}</div>
          </div>
        )}
      </nav>
    </>
  )
}
