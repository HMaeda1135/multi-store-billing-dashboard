import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '../mock/storage'
import { createStore } from '../api/stores'
import { fetchStores } from '../api/stores'
import { createVendor } from '../api/vendors'
import { fetchVendors } from '../api/vendors'

describe('master data shared source', () => {
  beforeEach(() => {
    db.reset()
  })

  it('店舗追加後に fetchStores で取得できる', async () => {
    await createStore({
      name: 'テスト店舗',
      code: 'TST-999',
      address: '東京都千代田区',
      managerName: 'テスト太郎',
      isActive: true,
    })

    const stores = await fetchStores()
    expect(stores.some((s) => s.name === 'テスト店舗')).toBe(true)
  })

  it('取引先追加後に fetchVendors で取得できる', async () => {
    await createVendor({
      name: 'テスト取引先',
      vendorType: 'supplier',
      contactName: 'テスト花子',
      email: 'test@example.com',
      phone: '03-0000-0000',
      isActive: true,
    })

    const vendors = await fetchVendors()
    expect(vendors.some((v) => v.name === 'テスト取引先')).toBe(true)
  })
})
