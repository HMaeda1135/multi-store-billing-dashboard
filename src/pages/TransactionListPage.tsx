import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTransactions } from '../hooks/useTransactions'
import { useStores } from '../hooks/useStores'
import { useVendors } from '../hooks/useVendors'
import { PageHeader } from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Loading } from '../components/common/Loading'
import { exportToCsv } from '../lib/csv'
import { formatCurrency, formatDate, getCurrentMonth } from '../lib/format'
import {
  transactionTypeLabels,
  transactionStatusLabels,
} from '../lib/labels'
import type { Transaction, TransactionFilters } from '../types'
import styles from './TransactionListPage.module.css'
import tableStyles from '../components/common/Table.module.css'

export function TransactionListPage() {
  const navigate = useNavigate()
  const { user, isStoreStaff } = useAuth()
  const { data: stores } = useStores()
  const { data: vendors } = useVendors()

  const [filters, setFilters] = useState<TransactionFilters>({
    storeId: isStoreStaff ? user?.storeId : '',
    month: '',
    transactionType: undefined,
    status: undefined,
    keyword: '',
  })
  const [keywordInput, setKeywordInput] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => {
        const keyword = keywordInput || undefined
        if (prev.keyword === keyword) return prev
        return { ...prev, keyword }
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [keywordInput])

  const activeFilters = useMemo(() => {
    const f: TransactionFilters = {}
    const storeId = isStoreStaff ? user?.storeId : filters.storeId
    if (storeId) f.storeId = storeId
    if (filters.month) f.month = filters.month
    if (filters.transactionType) f.transactionType = filters.transactionType
    if (filters.status) f.status = filters.status
    if (filters.keyword) f.keyword = filters.keyword
    return f
  }, [filters, isStoreStaff, user?.storeId])

  const { data: transactions, isPending } = useTransactions(activeFilters)

  const getStoreName = (storeId: string) =>
    stores?.find((s) => s.id === storeId)?.name ?? storeId

  const getVendorName = (vendorId: string) =>
    vendors?.find((v) => v.id === vendorId)?.name ?? vendorId

  const statusVariant = (status: Transaction['status']) => {
    const map = {
      draft: 'default' as const,
      submitted: 'warning' as const,
      confirmed: 'primary' as const,
      paid: 'success' as const,
    }
    return map[status]
  }

  const handleExportCsv = () => {
    if (!transactions?.length) return
    const headers = [
      '店舗名', '取引先名', '区分', '発生日', '金額', 'ステータス', '登録者', '更新日',
    ]
    const rows = transactions.map((t) => [
      getStoreName(t.storeId),
      getVendorName(t.vendorId),
      transactionTypeLabels[t.transactionType],
      t.transactionDate,
      String(t.amount),
      transactionStatusLabels[t.status],
      t.createdBy,
      t.updatedAt.slice(0, 10),
    ])
    exportToCsv(`transactions_${getCurrentMonth()}.csv`, headers, rows)
  }

  const updateFilter = <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }))
  }

  if (isPending && transactions === undefined) return <Loading />

  return (
    <div className="pageContainer">
      <PageHeader
        title="仕入れ・請求一覧"
        subtitle="登録済みの仕入れ・請求データを管理"
        actions={
          <>
            <Button variant="secondary" onClick={handleExportCsv}>
              CSV出力
            </Button>
            <Button onClick={() => navigate('/transactions/new')}>
              新規登録
            </Button>
          </>
        }
      />

      <Card>
        <div className={styles.filters}>
          {!isStoreStaff && (
            <div className={styles.filterField}>
              <label>店舗</label>
              <select
                value={filters.storeId ?? ''}
                onChange={(e) => updateFilter('storeId', e.target.value)}
              >
                <option value="">すべて</option>
                {stores?.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className={styles.filterField}>
            <label>月</label>
            <input
              type="month"
              value={filters.month ?? ''}
              onChange={(e) => updateFilter('month', e.target.value)}
            />
          </div>
          <div className={styles.filterField}>
            <label>区分</label>
            <select
              value={filters.transactionType ?? ''}
              onChange={(e) =>
                updateFilter('transactionType', e.target.value as TransactionFilters['transactionType'])
              }
            >
              <option value="">すべて</option>
              <option value="purchase">仕入れ</option>
              <option value="invoice">請求</option>
            </select>
          </div>
          <div className={styles.filterField}>
            <label>ステータス</label>
            <select
              value={filters.status ?? ''}
              onChange={(e) =>
                updateFilter('status', e.target.value as TransactionFilters['status'])
              }
            >
              <option value="">すべて</option>
              <option value="draft">下書き</option>
              <option value="submitted">提出済</option>
              <option value="confirmed">確認済</option>
              <option value="paid">支払済</option>
            </select>
          </div>
          <div className={styles.filterField}>
            <label>キーワード</label>
            <input
              type="text"
              placeholder="店舗名・取引先名など"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.resultCount}>
          {transactions?.length ?? 0} 件
        </div>

        <Table
          columns={[
            { key: 'store', header: '店舗名', render: (t) => getStoreName(t.storeId) },
            { key: 'vendor', header: '取引先名', render: (t) => getVendorName(t.vendorId) },
            {
              key: 'type',
              header: '区分',
              render: (t) => (
                <Badge variant={t.transactionType}>
                  {transactionTypeLabels[t.transactionType]}
                </Badge>
              ),
            },
            { key: 'date', header: '発生日', render: (t) => formatDate(t.transactionDate) },
            {
              key: 'amount',
              header: '金額',
              className: tableStyles.numeric,
              render: (t) => formatCurrency(t.amount),
            },
            {
              key: 'status',
              header: 'ステータス',
              render: (t) => (
                <Badge variant={statusVariant(t.status)}>
                  {transactionStatusLabels[t.status]}
                </Badge>
              ),
            },
            { key: 'createdBy', header: '登録者', render: (t) => t.createdBy },
            { key: 'updated', header: '更新日', render: (t) => formatDate(t.updatedAt) },
          ]}
          data={transactions ?? []}
          keyExtractor={(t) => t.id}
          onRowClick={(t) => navigate(`/transactions/${t.id}`)}
        />
      </Card>
    </div>
  )
}
