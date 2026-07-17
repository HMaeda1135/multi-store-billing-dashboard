import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('子要素を表示する', () => {
    render(<Badge>確認済</Badge>)
    expect(screen.getByText('確認済')).toBeInTheDocument()
  })

  it('variantクラスが適用される', () => {
    render(<Badge variant="success">支払済</Badge>)
    const badge = screen.getByText('支払済')
    expect(badge.className).toContain('success')
  })
})
