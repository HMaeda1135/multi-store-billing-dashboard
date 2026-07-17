import { useNavigate } from 'react-router-dom'
import { useDashboard } from '../hooks/useDashboard'
import { useStores } from '../hooks/useStores'
import { useVendors } from '../hooks/useVendors'
import { PageHeader } from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Loading } from '../components/common/Loading'
import { formatCurrency, formatDate, formatDateTime } from '../lib/format'
import {
  transactionTypeLabels,
  transactionStatusLabels,
} from '../lib/labels'
import type { Transaction } from '../types'
import styles from './DashboardPage.module.css'
import tableStyles from '../components/common/Table.module.css'

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: summary, isLoading } = useDashboard()
  const { data: stores } = useStores()
  const { data: vendors } = useVendors()

  if (isLoading || !summary) return <Loading />

  const maxTrendValue = Math.max(
    ...summary.monthlyTrend.flatMap((m) => [m.purchaseTotal, m.invoiceTotal]),
    1,
  )

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

  return (
    <div>
      <PageHeader
        title="ダッシュボード"
        subtitle="今月の仕入れ・請求状況の概要"
      />

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>今月の仕入れ合計</div>
          <div className={`${styles.summaryValue} ${styles.purchase}`}>
            {formatCurrency(summary.purchaseTotal)}
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>今月の請求合計</div>
          <div className={`${styles.summaryValue} ${styles.invoice}`}>
            {formatCurrency(summary.invoiceTotal)}
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>未確認件数</div>
          <div className={`${styles.summaryValue} ${styles.warning}`}>
            {summary.unconfirmedCount} 件
          </div>
        </div>
      </div>

      <div className={styles.grid2}>
        <Card title="店舗別集計（今月）">
          <Table
            columns={[
              { key: 'store', header: '店舗名', render: (r) => r.storeName },
              {
                key: 'purchase',
                header: '仕入れ',
                className: tableStyles.numeric,
                render: (r) => formatCurrency(r.purchaseTotal),
              },
              {
                key: 'invoice',
                header: '請求',
                className: tableStyles.numeric,
                render: (r) => formatCurrency(r.invoiceTotal),
              },
            ]}
            data={summary.storeBreakdown}
            keyExtractor={(r) => r.storeId}
            emptyMessage="データがありません"
          />
        </Card>

        <Card title="月別推移（直近6ヶ月）">
          <div className={styles.barChart}>
            {summary.monthlyTrend.map((m) => (
              <div key={m.month} className={styles.barRow}>
                <span className={styles.barLabel}>{m.month.slice(5)}月</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barPurchase}
                    style={{ width: `${(m.purchaseTotal / maxTrendValue) * 100}%` }}
                    title={`仕入れ: ${formatCurrency(m.purchaseTotal)}`}
                  />
                  <div
                    className={styles.barInvoice}
                    style={{ width: `${(m.invoiceTotal / maxTrendValue) * 100}%` }}
                    title={`請求: ${formatCurrency(m.invoiceTotal)}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.barLegend}>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#7c3aed' }} />
              仕入れ
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#0284c7' }} />
              請求
            </span>
          </div>
        </Card>
      </div>

      <Card title="最近登録されたデータ">
        <Table
          columns={[
            {
              key: 'store',
              header: '店舗名',
              render: (t) => getStoreName(t.storeId),
            },
            {
              key: 'vendor',
              header: '取引先',
              render: (t) => getVendorName(t.vendorId),
            },
            {
              key: 'type',
              header: '区分',
              render: (t) => (
                <Badge variant={t.transactionType}>
                  {transactionTypeLabels[t.transactionType]}
                </Badge>
              ),
            },
            {
              key: 'date',
              header: '発生日',
              render: (t) => formatDate(t.transactionDate),
            },
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
            {
              key: 'created',
              header: '登録日時',
              render: (t) => formatDateTime(t.createdAt),
            },
          ]}
          data={summary.recentTransactions}
          keyExtractor={(t) => t.id}
          onRowClick={(t) => navigate(`/transactions/${t.id}`)}
        />
      </Card>
    </div>
  )
}
