import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../contexts/AuthContext'
import { useTransaction, useCreateTransaction, useUpdateTransaction } from '../hooks/useTransactions'
import { useStores } from '../hooks/useStores'
import { useVendors } from '../hooks/useVendors'
import { transactionSchema, type TransactionSchemaType } from '../schemas'
import { PageHeader } from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { FormInput, FormSelect, FormTextarea } from '../components/common/FormField'
import { Loading } from '../components/common/Loading'
import {
  transactionTypeLabels,
  transactionStatusLabels,
  taxTypeLabels,
  getDueDateLabel,
} from '../lib/labels'
import styles from './TransactionFormPage.module.css'

export function TransactionFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { user, isStoreStaff } = useAuth()

  const { data: existing, isLoading: loadingTxn } = useTransaction(id ?? '')
  const { data: stores } = useStores()
  const { data: vendors } = useVendors()
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionSchemaType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      storeId: isStoreStaff ? user?.storeId ?? '' : '',
      vendorId: '',
      transactionType: 'purchase',
      transactionDate: new Date().toISOString().slice(0, 10),
      dueDate: '',
      amount: undefined,
      taxType: 'tax_excluded',
      status: 'draft',
      memo: '',
    },
  })

  const transactionType = watch('transactionType')

  useEffect(() => {
    if (existing) {
      reset({
        storeId: existing.storeId,
        vendorId: existing.vendorId,
        transactionType: existing.transactionType,
        transactionDate: existing.transactionDate,
        dueDate: existing.dueDate,
        amount: existing.amount,
        taxType: existing.taxType,
        status: existing.status,
        memo: existing.memo ?? '',
      })
    }
  }, [existing, reset])

  const onSubmit = async (data: TransactionSchemaType) => {
    if (isEdit && id) {
      await updateMutation.mutateAsync({ id, data })
      navigate(`/transactions/${id}`)
    } else {
      const created = await createMutation.mutateAsync({
        data,
        createdBy: user?.name ?? '不明',
      })
      navigate(`/transactions/${created.id}`)
    }
  }

  if (isEdit && loadingTxn) return <Loading />

  const activeStores = stores?.filter((s) => s.isActive) ?? []
  const activeVendors = vendors?.filter((v) => v.isActive) ?? []

  return (
    <div className={styles.formPage}>
      <PageHeader
        title={isEdit ? '仕入れ・請求 編集' : '仕入れ・請求 新規登録'}
        subtitle={isEdit ? '登録済みデータを編集します' : '新しい仕入れ・請求データを登録します'}
        actions={
          <Button variant="secondary" onClick={() => navigate(-1)}>
            キャンセル
          </Button>
        }
      />

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <FormSelect
            label="店舗"
            required
            error={errors.storeId?.message}
            disabled={isStoreStaff}
            {...register('storeId')}
          >
            <option value="">選択してください</option>
            {activeStores.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </FormSelect>

          <FormSelect
            label="取引先"
            required
            error={errors.vendorId?.message}
            {...register('vendorId')}
          >
            <option value="">選択してください</option>
            {activeVendors.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </FormSelect>

          <FormSelect
            label="区分"
            required
            error={errors.transactionType?.message}
            {...register('transactionType')}
          >
            {Object.entries(transactionTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </FormSelect>

          <FormSelect
            label="ステータス"
            required
            error={errors.status?.message}
            {...register('status')}
          >
            {Object.entries(transactionStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </FormSelect>

          <FormInput
            label="発生日"
            type="date"
            required
            error={errors.transactionDate?.message}
            {...register('transactionDate')}
          />

          <FormInput
            label={getDueDateLabel(transactionType)}
            type="date"
            required
            error={errors.dueDate?.message}
            {...register('dueDate')}
          />

          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <FormInput
                label="金額（円）"
                type="number"
                required
                min={1}
                error={errors.amount?.message}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)}
              />
            )}
          />

          <FormSelect
            label="税区分"
            error={errors.taxType?.message}
            {...register('taxType')}
          >
            {Object.entries(taxTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </FormSelect>

          <div className={styles.fullWidth}>
            <FormTextarea
              label="メモ"
              error={errors.memo?.message}
              {...register('memo')}
            />
          </div>

          <div className={`${styles.fullWidth} ${styles.actions}`}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '保存中...' : isEdit ? '更新する' : '登録する'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
