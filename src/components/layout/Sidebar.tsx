import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { roleLabels } from '../../lib/labels'
import styles from './Sidebar.module.css'

const adminNavItems = [
  { to: '/dashboard', label: 'ダッシュボード' },
  { to: '/transactions', label: '仕入れ・請求一覧' },
  { to: '/stores', label: '店舗管理' },
  { to: '/vendors', label: '取引先管理' },
]

const staffNavItems = [
  { to: '/transactions', label: '仕入れ・請求一覧' },
]

export function Sidebar() {
  const { user, isAdmin } = useAuth()
  const navItems = isAdmin ? adminNavItems : staffNavItems

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoTitle}>仕入れ・請求管理</div>
        <div className={styles.logoSub}>Multi-Store Billing</div>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.footer}>
        {user && (
          <>
            <div>{user.name}</div>
            <div>{roleLabels[user.role]}</div>
          </>
        )}
      </div>
    </aside>
  )
}
