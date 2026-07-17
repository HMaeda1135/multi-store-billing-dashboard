import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUsers } from '../hooks/useUsers'
import { roleLabels } from '../lib/labels'
import { Loading } from '../components/common/Loading'
import type { User } from '../types'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const { data: users, isLoading } = useUsers()

  if (user) {
    navigate(user.role === 'admin' ? '/dashboard' : '/transactions', { replace: true })
    return null
  }

  const handleLogin = (user: User) => {
    login(user)
    navigate(user.role === 'admin' ? '/dashboard' : '/transactions')
  }

  if (isLoading) return <Loading />

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>仕入れ・請求管理システム</h1>
        <p className={styles.subtitle}>Multi-Store Billing Dashboard</p>

        <div className={styles.notice}>
          本システムは自主制作ポートフォリオ用のサンプルです。
          ユーザーを選択してログインしてください（本格認証は実装していません）。
        </div>

        <div className={styles.userList}>
          {users?.map((user) => (
            <div
              key={user.id}
              className={styles.userCard}
              onClick={() => handleLogin(user)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin(user)}
            >
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userEmail}>{user.email}</span>
              </div>
              <span
                className={`${styles.roleBadge} ${
                  user.role === 'admin' ? styles.adminBadge : styles.staffBadge
                }`}
              >
                {roleLabels[user.role]}
              </span>
            </div>
          ))}
        </div>

        <p className={styles.footer}>
          ※ 架空の小規模事業者向けサンプルデータを使用しています
        </p>
      </div>
    </div>
  )
}
