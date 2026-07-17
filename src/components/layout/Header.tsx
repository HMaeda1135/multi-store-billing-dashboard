import { useAuth } from '../../contexts/AuthContext'
import { roleLabels } from '../../lib/labels'
import { Button } from '../common/Button'
import styles from './Header.module.css'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className={styles.header}>
      <div className={styles.breadcrumb}>サンプル事業者 管理システム</div>
      <div className={styles.userArea}>
        {user && (
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userRole}>{roleLabels[user.role]}</div>
          </div>
        )}
        <Button variant="secondary" size="small" onClick={logout}>
          ログアウト
        </Button>
      </div>
    </header>
  )
}
