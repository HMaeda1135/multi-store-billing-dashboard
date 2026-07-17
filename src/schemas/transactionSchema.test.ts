import { describe, it, expect } from 'vitest'
import { transactionSchema } from '../schemas'

describe('transactionSchema', () => {
  const validData = {
    storeId: 'store-1',
    vendorId: 'vendor-1',
    transactionType: 'purchase' as const,
    transactionDate: '2026-07-01',
    dueDate: '2026-07-31',
    amount: 10000,
    taxType: 'tax_excluded' as const,
    status: 'draft' as const,
    memo: 'テストメモ',
  }

  it('有効なデータを受け入れる', () => {
    const result = transactionSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('店舗未選択でエラーになる', () => {
    const result = transactionSchema.safeParse({ ...validData, storeId: '' })
    expect(result.success).toBe(false)
  })

  it('金額が0以下でエラーになる', () => {
    const result = transactionSchema.safeParse({ ...validData, amount: 0 })
    expect(result.success).toBe(false)
  })

  it('メモは任意', () => {
    const { memo: _, ...withoutMemo } = validData
    const result = transactionSchema.safeParse(withoutMemo)
    expect(result.success).toBe(true)
  })
})
