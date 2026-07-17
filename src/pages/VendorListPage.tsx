import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useVendors, useCreateVendor, useUpdateVendor } from '../hooks/useVendors'
import { vendorSchema, type VendorSchemaType } from '../schemas'
import { PageHeader } from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import { Table } from '../components/common/Table'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Modal } from '../components/common/Modal'
import { FormInput, FormSelect, FormCheckbox } from '../components/common/FormField'
import { Loading } from '../components/common/Loading'
import { vendorTypeLabels } from '../lib/labels'
import type { Vendor } from '../types'
import styles from './MasterPage.module.css'

export function VendorListPage() {
  const { data: vendors, isLoading } = useVendors()
  const createMutation = useCreateVendor()
  const updateMutation = useUpdateVendor()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VendorSchemaType>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: '',
      vendorType: 'supplier',
      contactName: '',
      email: '',
      phone: '',
      isActive: true,
    },
  })

  const openCreate = () => {
    setEditingVendor(null)
    reset({
      name: '',
      vendorType: 'supplier',
      contactName: '',
      email: '',
      phone: '',
      isActive: true,
    })
    setModalOpen(true)
  }

  const openEdit = (vendor: Vendor) => {
    setEditingVendor(vendor)
    reset({
      name: vendor.name,
      vendorType: vendor.vendorType,
      contactName: vendor.contactName,
      email: vendor.email,
      phone: vendor.phone,
      isActive: vendor.isActive,
    })
    setModalOpen(true)
  }

  const onSubmit = async (data: VendorSchemaType) => {
    if (editingVendor) {
      await updateMutation.mutateAsync({ id: editingVendor.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
    setModalOpen(false)
  }

  if (isLoading) return <Loading />

  return (
    <div>
      <PageHeader
        title="取引先管理"
        subtitle="取引先マスタの一覧・登録・編集"
        actions={<Button onClick={openCreate}>新規追加</Button>}
      />

      <Card noPadding>
        <Table
          columns={[
            { key: 'name', header: '取引先名', render: (v) => v.name },
            {
              key: 'type',
              header: '種別',
              render: (v) => vendorTypeLabels[v.vendorType],
            },
            { key: 'contact', header: '担当者名', render: (v) => v.contactName },
            { key: 'email', header: 'メールアドレス', render: (v) => v.email },
            { key: 'phone', header: '電話番号', render: (v) => v.phone },
            {
              key: 'active',
              header: '状態',
              render: (v) => (
                <Badge variant={v.isActive ? 'success' : 'default'}>
                  {v.isActive ? '有効' : '無効'}
                </Badge>
              ),
            },
            {
              key: 'actions',
              header: '',
              render: (v) => (
                <Button variant="ghost" size="small" onClick={() => openEdit(v)}>
                  編集
                </Button>
              ),
            },
          ]}
          data={vendors ?? []}
          keyExtractor={(v) => v.id}
        />
      </Card>

      {modalOpen && (
        <Modal
          title={editingVendor ? '取引先を編集' : '取引先を追加'}
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
            <FormInput label="取引先名" required error={errors.name?.message} {...register('name')} />
            <FormSelect label="種別" error={errors.vendorType?.message} {...register('vendorType')}>
              {Object.entries(vendorTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </FormSelect>
            <FormInput label="担当者名" required error={errors.contactName?.message} {...register('contactName')} />
            <FormInput label="メールアドレス" required error={errors.email?.message} {...register('email')} />
            <FormInput label="電話番号" required error={errors.phone?.message} {...register('phone')} />
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
