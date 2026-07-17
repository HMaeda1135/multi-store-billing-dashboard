export type UserRole = 'admin' | 'store_staff'

export type TransactionType = 'purchase' | 'invoice'

export type TransactionStatus = 'draft' | 'submitted' | 'confirmed' | 'paid'

export type TaxType = 'tax_included' | 'tax_excluded' | 'non_taxable'

export type VendorType = 'supplier' | 'customer' | 'both'

export type Store = {
  id: string
  name: string
  code: string
  address: string
  managerName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type Vendor = {
  id: string
  name: string
  vendorType: VendorType
  contactName: string
  email: string
  phone: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type Transaction = {
  id: string
  storeId: string
  vendorId: string
  transactionType: TransactionType
  transactionDate: string
  dueDate: string
  amount: number
  taxType: TaxType
  status: TransactionStatus
  memo?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  storeId?: string
}

export type TransactionFilters = {
  storeId?: string
  month?: string
  transactionType?: TransactionType
  status?: TransactionStatus
  keyword?: string
}

export type DashboardSummary = {
  purchaseTotal: number
  invoiceTotal: number
  unconfirmedCount: number
  storeBreakdown: { storeId: string; storeName: string; purchaseTotal: number; invoiceTotal: number }[]
  monthlyTrend: { month: string; purchaseTotal: number; invoiceTotal: number }[]
  recentTransactions: Transaction[]
}

export type TransactionFormData = {
  storeId: string
  vendorId: string
  transactionType: TransactionType
  transactionDate: string
  dueDate: string
  amount: number
  taxType: TaxType
  status: TransactionStatus
  memo?: string
}

export type StoreFormData = {
  name: string
  code: string
  address: string
  managerName: string
  isActive: boolean
}

export type VendorFormData = {
  name: string
  vendorType: VendorType
  contactName: string
  email: string
  phone: string
  isActive: boolean
}
