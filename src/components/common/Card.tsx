import type { ReactNode } from 'react'
import styles from './Card.module.css'

type CardProps = {
  title?: string
  children: ReactNode
  noPadding?: boolean
  className?: string
}

export function Card({ title, children, noPadding, className }: CardProps) {
  return (
    <div className={[styles.card, className].filter(Boolean).join(' ')}>
      {title && (
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>
      )}
      <div className={noPadding ? styles.noPadding : styles.body}>{children}</div>
    </div>
  )
}
