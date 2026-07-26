export type AccountType = 'cash' | 'bank' | 'wallet' | 'credit' | 'investment';

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: AccountType;
  color: string;
  iconName: string;
  isDefault?: boolean;
  initialBalance: number;
  accountNumber?: string;
}

export type TransactionType = 'expense' | 'income' | 'transfer';

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income';
  iconName: string;
  color: string;
  budgetLimit?: number; // Monthly budget limit in primary currency
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  accountId: string;
  targetAccountId?: string; // For transfers
  categoryId: string;
  name: string; // Itemization, e.g. "Grocery", "Sahod / Salary"
  timestamp: string; // ISO string with precise time
  note?: string;
  transferFee?: number;
}

export interface RecurringSubscription {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  accountId: string;
  frequency: 'monthly' | 'weekly' | 'yearly';
  nextDueDate: string; // ISO date YYYY-MM-DD
  active: boolean;
}

export interface FinancialInsight {
  summary: string;
  healthScore: number; // 0 to 100
  topSpendingCategory: string;
  savingsRatePercentage: number;
  actionableTips: string[];
  monthlyForecast: string;
}

export type CurrencyCode = 'PHP' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'SGD' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
}
