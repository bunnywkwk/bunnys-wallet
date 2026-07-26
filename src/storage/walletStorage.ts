import { Account, Category, CurrencyCode, RecurringSubscription, Transaction, TransactionType } from '../types';
import { DEFAULT_ACCOUNTS, DEFAULT_CATEGORIES, DEFAULT_RECURRING, SAMPLE_PRESET_TRANSACTIONS } from '../data/initialData';

const STORAGE_KEYS = {
  ACCOUNTS: 'vault_accounts_v1',
  TRANSACTIONS: 'vault_transactions_v1',
  CATEGORIES: 'vault_categories_v1',
  RECURRING: 'vault_recurring_v1',
  CURRENCY: 'vault_currency_v1',
  PRIVACY: 'vault_privacy_mode_v1',
};

export class WalletStorageManager {
  static getAccounts(): Account[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (!data) {
        this.saveAccounts(DEFAULT_ACCOUNTS);
        return DEFAULT_ACCOUNTS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  }

  static saveAccounts(accounts: Account[]) {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    window.dispatchEvent(new Event('vault_data_updated'));
  }

  static getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!data) {
        this.saveCategories(DEFAULT_CATEGORIES);
        return DEFAULT_CATEGORIES;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }

  static saveCategories(categories: Category[]) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new Event('vault_data_updated'));
  }

  static getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (!data) {
        this.saveTransactions([]);
        return [];
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static saveTransactions(transactions: Transaction[]) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    window.dispatchEvent(new Event('vault_data_updated'));
  }

  static getRecurring(): RecurringSubscription[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECURRING);
      if (!data) {
        this.saveRecurring([]);
        return [];
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static saveRecurring(items: RecurringSubscription[]) {
    localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(items));
    window.dispatchEvent(new Event('vault_data_updated'));
  }

  static getCurrency(): CurrencyCode {
    return (localStorage.getItem(STORAGE_KEYS.CURRENCY) as CurrencyCode) || 'PHP';
  }

  static setCurrency(currency: CurrencyCode) {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
    window.dispatchEvent(new Event('vault_data_updated'));
  }

  static getPrivacyMode(): boolean {
    return localStorage.getItem(STORAGE_KEYS.PRIVACY) === 'true';
  }

  static setPrivacyMode(hide: boolean) {
    localStorage.setItem(STORAGE_KEYS.PRIVACY, hide ? 'true' : 'false');
    window.dispatchEvent(new Event('vault_data_updated'));
  }

  /**
   * Log a new transaction and automatically update account balances
   */
  static addTransaction(txData: Omit<Transaction, 'id'>): Transaction {
    const transactions = this.getTransactions();
    const accounts = this.getAccounts();

    const newTx: Transaction = {
      ...txData,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };

    // Update account balance
    const updatedAccounts = accounts.map((acc) => {
      if (txData.type === 'expense' && acc.id === txData.accountId) {
        return { ...acc, balance: acc.balance - txData.amount };
      }
      if (txData.type === 'income' && acc.id === txData.accountId) {
        return { ...acc, balance: acc.balance + txData.amount };
      }
      if (txData.type === 'transfer') {
        if (acc.id === txData.accountId) {
          // Source account deducts amount + fee
          const fee = txData.transferFee || 0;
          return { ...acc, balance: acc.balance - (txData.amount + fee) };
        }
        if (acc.id === txData.targetAccountId) {
          // Target account receives amount
          return { ...acc, balance: acc.balance + txData.amount };
        }
      }
      return acc;
    });

    const updatedTxs = [newTx, ...transactions];

    this.saveAccounts(updatedAccounts);
    this.saveTransactions(updatedTxs);
    return newTx;
  }

  /**
   * Delete a transaction and reverse its effect on account balances
   */
  static deleteTransaction(txId: string) {
    const transactions = this.getTransactions();
    const targetTx = transactions.find((t) => t.id === txId);
    if (!targetTx) return;

    const accounts = this.getAccounts();

    // Reverse balance effect
    const updatedAccounts = accounts.map((acc) => {
      if (targetTx.type === 'expense' && acc.id === targetTx.accountId) {
        return { ...acc, balance: acc.balance + targetTx.amount };
      }
      if (targetTx.type === 'income' && acc.id === targetTx.accountId) {
        return { ...acc, balance: acc.balance - targetTx.amount };
      }
      if (targetTx.type === 'transfer') {
        if (acc.id === targetTx.accountId) {
          const fee = targetTx.transferFee || 0;
          return { ...acc, balance: acc.balance + targetTx.amount + fee };
        }
        if (acc.id === targetTx.targetAccountId) {
          return { ...acc, balance: acc.balance - targetTx.amount };
        }
      }
      return acc;
    });

    const filteredTxs = transactions.filter((t) => t.id !== txId);

    this.saveAccounts(updatedAccounts);
    this.saveTransactions(filteredTxs);
  }

  /**
   * Update starting balance or details of an existing account
   */
  static updateAccount(accId: string, updates: Partial<Account>) {
    const accounts = this.getAccounts();
    const updated = accounts.map((acc) => (acc.id === accId ? { ...acc, ...updates } : acc));
    this.saveAccounts(updated);
  }

  /**
   * Create custom bank account or digital wallet
   */
  static addAccount(newAcc: Omit<Account, 'id'>): Account {
    const accounts = this.getAccounts();
    const account: Account = {
      ...newAcc,
      id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    this.saveAccounts([...accounts, account]);
    return account;
  }

  /**
   * Add custom category
   */
  static addCategory(newCat: Omit<Category, 'id'>): Category {
    const categories = this.getCategories();
    const category: Category = {
      ...newCat,
      id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    this.saveCategories([...categories, category]);
    return category;
  }

  /**
   * Update category budget limit
   */
  static updateCategoryBudget(catId: string, budgetLimit: number | undefined) {
    const categories = this.getCategories();
    const updated = categories.map((c) => (c.id === catId ? { ...c, budgetLimit } : c));
    this.saveCategories(updated);
  }

  /**
   * Clear all transactions and reset account balances to 0 for a clean empty start
   */
  static clearAllData() {
    const cleanAccounts = DEFAULT_ACCOUNTS.map((acc) => ({ ...acc, balance: 0, initialBalance: 0 }));
    this.saveAccounts(cleanAccounts);
    this.saveCategories(DEFAULT_CATEGORIES);
    this.saveTransactions([]);
    this.saveRecurring([]);
    this.setCurrency('PHP');
  }

  /**
   * Load Philippines sample preset data for testing
   */
  static resetToPreset() {
    this.saveAccounts(DEFAULT_ACCOUNTS);
    this.saveCategories(DEFAULT_CATEGORIES);
    this.saveTransactions(SAMPLE_PRESET_TRANSACTIONS);
    this.saveRecurring(DEFAULT_RECURRING);
    this.setCurrency('PHP');
  }
}
