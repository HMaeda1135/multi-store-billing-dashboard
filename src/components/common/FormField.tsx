import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react'
import styles from './FormField.module.css'

type BaseFieldProps = {
  label: string
  error?: string
  required?: boolean
}

export function FormInput({
  label,
  error,
  required,
  className,
  ...props
}: BaseFieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={styles.field}>
      <label className={`${styles.label} ${required ? styles.required : ''}`}>{label}</label>
      <input
        className={[styles.input, error ? styles.error : '', className].filter(Boolean).join(' ')}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  )
}

export function FormSelect({
  label,
  error,
  required,
  children,
  className,
  ...props
}: BaseFieldProps & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <div className={styles.field}>
      <label className={`${styles.label} ${required ? styles.required : ''}`}>{label}</label>
      <select
        className={[styles.select, error ? styles.error : '', className].filter(Boolean).join(' ')}
        {...props}
      >
        {children}
      </select>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  )
}

export function FormTextarea({
  label,
  error,
  required,
  className,
  ...props
}: BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={styles.field}>
      <label className={`${styles.label} ${required ? styles.required : ''}`}>{label}</label>
      <textarea
        className={[styles.textarea, error ? styles.error : '', className].filter(Boolean).join(' ')}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  )
}

export function FormCheckbox({
  label,
  error,
  checked,
  onChange,
}: {
  label: string
  error?: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className={styles.field}>
      <div className={styles.checkboxRow}>
        <input
          type="checkbox"
          id={label}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label htmlFor={label}>{label}</label>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  )
}
