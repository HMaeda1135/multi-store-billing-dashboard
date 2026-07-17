import styles from './Loading.module.css'

export function Loading({ message = '読み込み中...' }: { message?: string }) {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
      {message}
    </div>
  )
}
