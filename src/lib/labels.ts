import type {
  TransactionType,
  TransactionStatus,
  TaxType,
  VendorType,
} from '../types'

export const transactionTypeLabels: Record<TransactionType, string> = {
  purchase: '仕入れ',
  invoice: '請求',
}

export const transactionStatusLabels: Record<TransactionStatus, string> = {
  draft: '下書き',
  submitted: '提出済',
  confirmed: '確認済',
  paid: '支払済',
}

export const taxTypeLabels: Record<TaxType, string> = {
  tax_included: '税込',
  tax_excluded: '税抜',
  non_taxable: '非課税',
}

export const vendorTypeLabels: Record<VendorType, string> = {
  supplier: '仕入先',
  customer: '得意先',
  both: '両方',
}

export const roleLabels = {
  admin: '管理者',
  store_staff: '店舗担当者',
} as const

export function getDueDateLabel(type: TransactionType): string {
  return type === 'purchase' ? '支払予定日' : '請求予定日'
}
