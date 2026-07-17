import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '../mock/storage'
import { fetchTransactions, createTransaction } from '../api/transactions'
import { initialTransactions } from '../mock/data'

describe('transactions API', () => {
  beforeEach(() => {
    db.reset()
  })

  it('全件取得できる', async () => {
    const result = await fetchTransactions()
    expect(result.length).toBe(initialTransactions.length)
  })

  it('店舗で絞り込める', async () => {
    const result = await fetchTransactions({ storeId: 'store-1' })
    expect(result.every((t) => t.storeId === 'store-1')).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('キーワード検索ができる', async () => {
    const result = await fetchTransactions({ keyword: 'フレッシュ' })
    expect(result.length).toBeGreaterThan(0)
  })

  it('新規登録できる', async () => {
    const created = await createTransaction(
      {
        storeId: 'store-1',
        vendorId: 'vendor-1',
        transactionType: 'purchase',
        transactionDate: '2026-07-15',
        dueDate: '2026-07-31',
        amount: 5000,
        taxType: 'tax_excluded',
        status: 'draft',
      },
      'テストユーザー',
    )
    expect(created.id).toBeDefined()
    expect(created.createdBy).toBe('テストユーザー')

    const all = await fetchTransactions()
    expect(all.length).toBe(initialTransactions.length + 1)
  })
})
