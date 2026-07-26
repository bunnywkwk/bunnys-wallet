import { Account, Category, CurrencyConfig, RecurringSubscription, Transaction } from '../types';

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

export const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: 'acc_cash',
    name: 'Cash',
    balance: 3500,
    initialBalance: 3500,
    type: 'cash',
    color: '#10B981', // Emerald
    iconName: 'Banknote',
    isDefault: true,
  },
  {
    id: 'acc_gcash',
    name: 'GCash',
    balance: 12450,
    initialBalance: 12450,
    type: 'wallet',
    color: '#005CE6', // GCash Blue
    iconName: 'Smartphone',
    isDefault: true,
  },
  {
    id: 'acc_bdo',
    name: 'BDO Unibank',
    balance: 48900,
    initialBalance: 48900,
    type: 'bank',
    color: '#002B66', // BDO Dark Navy
    iconName: 'Building2',
    isDefault: true,
  },
];

export const DEFAULT_CATEGORIES: Category[] = [
  // Expenses
  { id: 'cat_food', name: 'Food & Dining', type: 'expense', iconName: 'Utensils', color: '#F59E0B', budgetLimit: 8000 },
  { id: 'cat_grocery', name: 'Groceries', type: 'expense', iconName: 'ShoppingCart', color: '#10B981', budgetLimit: 12000 },
  { id: 'cat_transport', name: 'Transport & Gas', type: 'expense', iconName: 'Car', color: '#3B82F6', budgetLimit: 4000 },
  { id: 'cat_bills', name: 'Bills & Utilities', type: 'expense', iconName: 'Zap', color: '#EF4444', budgetLimit: 7500 },
  { id: 'cat_shopping', name: 'Shopping', type: 'expense', iconName: 'ShoppingBag', color: '#8B5CF6', budgetLimit: 5000 },
  { id: 'cat_entertainment', name: 'Entertainment & Subscriptions', type: 'expense', iconName: 'Film', color: '#EC4899', budgetLimit: 2500 },
  { id: 'cat_health', name: 'Healthcare & Pharma', type: 'expense', iconName: 'HeartPulse', color: '#14B8A6', budgetLimit: 3000 },
  { id: 'cat_education', name: 'Education & Books', type: 'expense', iconName: 'BookOpen', color: '#6366F1', budgetLimit: 2000 },
  { id: 'cat_misc_exp', name: 'Miscellaneous Expense', type: 'expense', iconName: 'MoreHorizontal', color: '#6B7280' },

  // Income
  { id: 'cat_salary', name: 'Salary / Sahod', type: 'income', iconName: 'Briefcase', color: '#10B981' },
  { id: 'cat_freelance', name: 'Freelance & Side Gig', type: 'income', iconName: 'Laptop', color: '#3B82F6' },
  { id: 'cat_investment', name: 'Investments & Dividends', type: 'income', iconName: 'TrendingUp', color: '#8B5CF6' },
  { id: 'cat_gift', name: 'Gifts & Rewards', type: 'income', iconName: 'Gift', color: '#F59E0B' },
  { id: 'cat_misc_inc', name: 'Other Income', type: 'income', iconName: 'PlusCircle', color: '#14B8A6' },
  
  // Transfer
  { id: 'cat_transfer', name: 'Account Transfer', type: 'expense', iconName: 'ArrowRightLeft', color: '#6366F1' },
];

export const DEFAULT_RECURRING: RecurringSubscription[] = [
  {
    id: 'sub_netflix',
    name: 'Netflix Premium',
    amount: 549,
    categoryId: 'cat_entertainment',
    accountId: 'acc_gcash',
    frequency: 'monthly',
    nextDueDate: '2026-08-01',
    active: true,
  },
  {
    id: 'sub_spotify',
    name: 'Spotify Family',
    amount: 239,
    categoryId: 'cat_entertainment',
    accountId: 'acc_gcash',
    frequency: 'monthly',
    nextDueDate: '2026-08-10',
    active: true,
  },
  {
    id: 'sub_internet',
    name: 'PLDT Fiber Wi-Fi',
    amount: 1899,
    categoryId: 'cat_bills',
    accountId: 'acc_bdo',
    frequency: 'monthly',
    nextDueDate: '2026-08-15',
    active: true,
  },
];

export const SAMPLE_PRESET_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_101',
    amount: 45000,
    type: 'income',
    accountId: 'acc_bdo',
    categoryId: 'cat_salary',
    name: 'Semi-Monthly Salary / Sahod',
    timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
    note: 'Direct deposit company payroll',
  },
  {
    id: 'tx_102',
    amount: 3250,
    type: 'expense',
    accountId: 'acc_gcash',
    categoryId: 'cat_grocery',
    name: 'SM Supermarket Groceries',
    timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
    note: 'Weekly essentials and fresh meat',
  },
  {
    id: 'tx_103',
    amount: 5000,
    type: 'transfer',
    accountId: 'acc_bdo',
    targetAccountId: 'acc_gcash',
    categoryId: 'cat_transfer',
    name: 'BDO to GCash Cash-in',
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    transferFee: 15,
  },
  {
    id: 'tx_104',
    amount: 420,
    type: 'expense',
    accountId: 'acc_cash',
    categoryId: 'cat_food',
    name: 'Iced Latte & Pastry @ Coffee Project',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'tx_105',
    amount: 2450,
    type: 'expense',
    accountId: 'acc_bdo',
    categoryId: 'cat_bills',
    name: 'Meralco Electric Bill',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'tx_106',
    amount: 12000,
    type: 'income',
    accountId: 'acc_gcash',
    categoryId: 'cat_freelance',
    name: 'Web UI Design Project Milestone',
    timestamp: new Date().toISOString(),
    note: 'Client payment via GCash',
  },
];
