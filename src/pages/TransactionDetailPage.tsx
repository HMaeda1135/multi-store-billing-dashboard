import { useNavigate, useParams } from 'react-router-dom'
import { useTransaction } from '../hooks/useTransactions'
import { useStores } from '../hooks/useStores'
import { useVendors } from '../hooks/useVendors'
import { PageHeader } from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Loading } from '../components/common/Loading'
import { formatCurrency, formatDate, formatDateTime } from '../lib/format'
import {
  transactionTypeLabels,
  transactionStatusLabels,
  taxTypeLabels,
  getDueDateLabel,
} from '../lib/labels'
import styles from './TransactionDetailPage.module.css'

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.detailItem}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  )
}

export function TransactionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: transaction, isLoading } = useTransaction(id ?? '')
  const { data: stores } = useStores()
  const { data: vendors } = useVendors()

  if (isLoading) return <Loading />
  if (!transaction) {
    return (
      <div>
        <PageHeader title="データが見つかりません" />
        <Button variant="secondary" onClick={() => navigate('/transactions')}>
          一覧に戻る
        </Button>
      </div>
    )
  }

  const store = stores?.find((s) => s.id === transaction.storeId)
  const vendor = vendors?.find((v) => v.id === transaction.vendorId)

  const statusVariant = {
    draft: 'default' as const,
    submitted: 'warning' as const,
    confirmed: 'primary' as const,
    paid: 'success' as const,
  }[transaction.status]

  return (
    <div className="pageContainer">
      <PageHeader
        title="仕入れ・請求 詳細"
        subtitle={`ID: ${transaction.id}`}
        actions={
          <Button variant="secondary" onClick={() => navigate('/transactions')}>
            一覧に戻る
          </Button>
        }
      />

      <Card>
        <div className={styles.detailGrid}>
          <DetailItem label="店舗" value={store?.name ?? transaction.storeId} />
          <DetailItem label="取引先" value={vendor?.name ?? transaction.vendorId} />
          <DetailItem
            label="区分"
            value={
              <Badge variant={transaction.transactionType}>
                {transactionTypeLabels[transaction.transactionType]}
              </Badge>
            }
          />
          <DetailItem
            label="ステータス"
            value={
              <Badge variant={statusVariant}>
                {transactionStatusLabels[transaction.status]}
              </Badge>
            }
          />
          <DetailItem label="発生日" value={formatDate(transaction.transactionDate)} />
          <DetailItem
            label={getDueDateLabel(transaction.transactionType)}
            value={formatDate(transaction.dueDate)}
          />
          <DetailItem label="金額" value={formatCurrency(transaction.amount)} />
          <DetailItem label="税区分" value={taxTypeLabels[transaction.taxType]} />
          <DetailItem label="登録者" value={transaction.createdBy} />
          <DetailItem label="作成日時" value={formatDateTime(transaction.createdAt)} />
          <DetailItem label="更新日時" value={formatDateTime(transaction.updatedAt)} />
          {transaction.memo && (
            <div className={styles.fullWidth}>
              <DetailItem label="メモ" value={transaction.memo} />
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button onClick={() => navigate(`/transactions/${transaction.id}/edit`)}>
            編集する
          </Button>
        </div>
      </Card>
    </div>
  )
}
