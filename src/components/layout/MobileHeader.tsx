import { useAuth } from '../../contexts/AuthContext'
import { roleLabels } from '../../lib/labels'
import { Button } from '../common/Button'
import styles from './MobileHeader.module.css'

type MobileHeaderProps = {
  onMenuToggle: () => void
}

export function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className={styles.mobileHeader}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onMenuToggle}
        aria-label="メニューを開く"
      >
        <span className={styles.menuIcon} />
      </button>
      <div className={styles.appTitle}>仕入れ・請求管理</div>
      <div className={styles.actions}>
        {user && (
          <span className={styles.roleBadge}>{roleLabels[user.role]}</span>
        )}
        <Button variant="secondary" size="small" onClick={logout}>
          ログアウト
        </Button>
      </div>
    </header>
  )
}
