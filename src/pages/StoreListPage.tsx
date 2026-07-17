import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useStores, useCreateStore, useUpdateStore } from '../hooks/useStores'
import { storeSchema, type StoreSchemaType } from '../schemas'
import { PageHeader } from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Modal } from '../components/common/Modal'
import { FormInput, FormCheckbox } from '../components/common/FormField'
import { Loading } from '../components/common/Loading'
import type { Store } from '../types'
import styles from './MasterPage.module.css'

export function StoreListPage() {
  const { data: stores, isLoading } = useStores()
  const createMutation = useCreateStore()
  const updateMutation = useUpdateStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<Store | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StoreSchemaType>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: '',
      code: '',
      address: '',
      managerName: '',
      isActive: true,
    },
  })

  const openCreate = () => {
    setEditingStore(null)
    reset({ name: '', code: '', address: '', managerName: '', isActive: true })
    setModalOpen(true)
  }

  const openEdit = (store: Store) => {
    setEditingStore(store)
    reset({
      name: store.name,
      code: store.code,
      address: store.address,
      managerName: store.managerName,
      isActive: store.isActive,
    })
    setModalOpen(true)
  }

  const onSubmit = async (data: StoreSchemaType) => {
    if (editingStore) {
      await updateMutation.mutateAsync({ id: editingStore.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
    setModalOpen(false)
  }

  if (isLoading) return <Loading />

  return (
    <div className="pageContainer">
      <PageHeader
        title="店舗管理"
        subtitle="店舗マスタの一覧・登録・編集"
        actions={<Button onClick={openCreate}>新規追加</Button>}
      />

      <Card noPadding>
        <Table
          columns={[
            { key: 'name', header: '店舗名', render: (s) => s.name },
            { key: 'code', header: '店舗コード', render: (s) => s.code },
            { key: 'address', header: '所在地', render: (s) => s.address },
            { key: 'manager', header: '担当者名', render: (s) => s.managerName },
            {
              key: 'active',
              header: '状態',
              render: (s) => (
                <Badge variant={s.isActive ? 'success' : 'default'}>
                  {s.isActive ? '有効' : '無効'}
                </Badge>
              ),
            },
            {
              key: 'actions',
              header: '',
              render: (s) => (
                <Button variant="ghost" size="small" onClick={() => openEdit(s)}>
                  編集
                </Button>
              ),
            },
          ]}
          data={stores ?? []}
          keyExtractor={(s) => s.id}
        />
      </Card>

      {modalOpen && (
        <Modal
          title={editingStore ? '店舗を編集' : '店舗を追加'}
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                {isSubmitting ? '保存中...' : '保存'}
              </Button>
            </>
          }
        >
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <FormInput label="店舗名" required error={errors.name?.message} {...register('name')} />
            <FormInput label="店舗コード" required error={errors.code?.message} {...register('code')} />
            <FormInput label="所在地" required error={errors.address?.message} {...register('address')} />
            <FormInput label="担当者名" required error={errors.managerName?.message} {...register('managerName')} />
            <FormCheckbox
              label="有効"
              checked={watch('isActive')}
              onChange={(v) => setValue('isActive', v)}
            />
          </form>
        </Modal>
      )}
    </div>
  )
}
