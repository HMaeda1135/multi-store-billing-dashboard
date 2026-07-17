import { z } from 'zod'

export const transactionSchema = z.object({
  storeId: z.string().min(1, '店舗を選択してください'),
  vendorId: z.string().min(1, '取引先を選択してください'),
  transactionType: z.enum(['purchase', 'invoice'], { message: '区分を選択してください' }),
  transactionDate: z.string().min(1, '発生日を入力してください'),
  dueDate: z.string().min(1, '予定日を入力してください'),
  amount: z.number().min(1, '金額は1円以上で入力してください'),
  taxType: z.enum(['tax_included', 'tax_excluded', 'non_taxable']),
  status: z.enum(['draft', 'submitted', 'confirmed', 'paid'], {
    message: 'ステータスを選択してください',
  }),
  memo: z.string().optional(),
})

export type TransactionSchemaType = z.infer<typeof transactionSchema>

export const storeSchema = z.object({
  name: z.string().min(1, '店舗名を入力してください'),
  code: z.string().min(1, '店舗コードを入力してください'),
  address: z.string().min(1, '所在地を入力してください'),
  managerName: z.string().min(1, '担当者名を入力してください'),
  isActive: z.boolean(),
})

export type StoreSchemaType = z.infer<typeof storeSchema>

export const vendorSchema = z.object({
  name: z.string().min(1, '取引先名を入力してください'),
  vendorType: z.enum(['supplier', 'customer', 'both']),
  contactName: z.string().min(1, '担当者名を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  phone: z.string().min(1, '電話番号を入力してください'),
  isActive: z.boolean(),
})

export type VendorSchemaType = z.infer<typeof vendorSchema>
