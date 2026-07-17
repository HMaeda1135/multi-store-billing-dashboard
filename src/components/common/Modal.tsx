import type { ReactNode } from 'react'
import styles from './Modal.module.css'

type ModalProps = {
  title: string
  children: ReactNode
  footer?: ReactNode
  onClose: () => void
}

export function Modal({ title, children, footer, onClose }: ModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="閉じる">
            ×
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  )
}
