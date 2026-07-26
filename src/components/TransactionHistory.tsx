import React, { useState } from 'react';
import {
  ListFilter,
  Search,
  Trash2,
  Calendar,
  X,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
} from 'lucide-react';
import { Account, Category, CurrencyCode, Transaction } from '../types';
import { WalletStorageManager } from '../storage/walletStorage';
import { IconRenderer } from './IconRenderer';
import { formatCurrency, formatDate } from '../utils/formatters';

interface TransactionHistoryProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  currency: CurrencyCode;
  privacyMode: boolean;
  selectedAccountIdFilter?: string | null;
  selectedCategoryIdFilter?: string | null;
  onClearFilters?: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  categories,
  accounts,
  currency,
  privacyMode,
  selectedAccountIdFilter,
  selectedCategoryIdFilter,
  onClearFilters,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income' | 'transfer'>('all');
  const [selectedTxDetail, setSelectedTxDetail] = useState<Transaction | null>(null);

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (selectedAccountIdFilter && t.accountId !== selectedAccountIdFilter && t.targetAccountId !== selectedAccountIdFilter) {
      return false;
    }
    if (selectedCategoryIdFilter && t.categoryId !== selectedCategoryIdFilter) {
      return false;
    }
    if (typeFilter !== 'all' && t.type !== typeFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchNote = (t.note || '').toLowerCase().includes(q);
      const catName = (categories.find((c) => c.id === t.categoryId)?.name || '').toLowerCase();
      if (!matchName && !matchNote && !catName.includes(q)) return false;
    }
    return true;
  });

  const handleDelete = (txId: string) => {
    if (confirm('Are you sure you want to delete this transaction? Account balance will be adjusted.')) {
      WalletStorageManager.deleteTransaction(txId);
      if (selectedTxDetail?.id === txId) {
        setSelectedTxDetail(null);
      }
    }
  };

  return (
    <section className="bg-[#111] border border-[#222] rounded-3xl p-6 shadow-2xl space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#141414] text-[#c5a059] border border-[#c5a059]/30">
            <ListFilter size={18} />
          </div>
          <div>
            <h2 className="text-lg font-serif text-[#f2f2f2]">Recent Transactions</h2>
            <p className="text-[10px] uppercase tracking-widest text-[#555]">
              Showing {filteredTransactions.length} of {transactions.length} records
            </p>
          </div>
        </div>

        {/* Active Filters Bar */}
        {(selectedAccountIdFilter || selectedCategoryIdFilter) && (
          <div className="flex items-center gap-2 bg-[#c5a059]/10 border border-[#c5a059]/30 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-[#c5a059]">
            <span>Filter Active</span>
            <button onClick={onClearFilters} className="hover:text-white">
              <X size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Search & Type Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-3 text-[#555]" />
          <input
            type="text"
            placeholder="Search items, notes, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0a0a0a] border border-[#222] text-xs text-[#f2f2f2] placeholder-[#555] focus:border-[#c5a059] focus:outline-none"
          />
        </div>

        <div className="flex bg-[#0a0a0a] p-1 rounded-full border border-[#222] w-full sm:w-auto">
          {(['all', 'expense', 'income', 'transfer'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium transition-colors ${
                typeFilter === t ? 'bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30 font-bold' : 'text-[#666] hover:text-[#888]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological List */}
      <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
        {transactions.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-3 bg-[#0a0a0a] rounded-2xl border border-[#222] my-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#141414] border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
              <Wallet size={22} />
            </div>
            <div>
              <h3 className="text-sm font-serif text-[#f2f2f2] font-semibold">Vault is Clean & Ready</h3>
              <p className="text-xs text-[#777] mt-1 max-w-xs mx-auto">
                No transactions recorded yet. Use the <strong>Calc</strong> tab to log your first transaction!
              </p>
            </div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-[#555] text-xs italic">
            No matching transactions found. Try resetting filters.
          </div>
        ) : (
          filteredTransactions.map((t) => {
            const category = categories.find((c) => c.id === t.categoryId);
            const account = accounts.find((a) => a.id === t.accountId);
            const targetAccount = accounts.find((a) => a.id === t.targetAccountId);

            const isIncome = t.type === 'income';
            const isExpense = t.type === 'expense';

            return (
              <div
                key={t.id}
                onClick={() => setSelectedTxDetail(t)}
                className="flex items-center justify-between p-3 border-b border-[#1a1a1a] hover:bg-[#181818] transition-colors rounded-xl cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-[#222]"
                    style={{
                      backgroundColor: `${category?.color || '#c5a059'}15`,
                      color: category?.color || '#c5a059',
                    }}
                  >
                    <IconRenderer
                      name={category?.iconName || (isIncome ? 'Briefcase' : 'Tag')}
                      size={16}
                      color={category?.color || '#c5a059'}
                    />
                  </div>

                  <div>
                    <h4 className="text-sm text-[#f2f2f2] font-medium flex items-center gap-2">
                      {t.name}
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#141414] border border-[#222] text-[#666]">
                        {account?.name || 'Account'}
                        {targetAccount ? ` → ${targetAccount.name}` : ''}
                      </span>
                    </h4>
                    <p className="text-[10px] text-[#555] mt-0.5 flex items-center gap-2">
                      <span>{formatDate(t.timestamp)}</span>
                      {t.note && <span className="truncate max-w-[140px] text-[#666]">• {t.note}</span>}
                    </p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-3">
                  <div>
                    <span
                      className={`text-sm font-mono tracking-tight block ${
                        isIncome ? 'text-[#c5a059] font-medium' : isExpense ? 'text-[#e0e0e0]' : 'text-indigo-300'
                      }`}
                    >
                      {privacyMode
                        ? '••••'
                        : `${isIncome ? '+ ' : isExpense ? '- ' : ''}${formatCurrency(t.amount, currency)}`}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(t.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#555] hover:text-rose-400 hover:bg-[#222] transition-all"
                    title="Delete record"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Drill-Down Detail Modal */}
      {selectedTxDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-[#222] rounded-3xl w-full max-w-sm p-6 text-[#e0e0e0] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222]">
              <h3 className="text-sm font-serif text-[#f2f2f2] uppercase tracking-widest">Transaction Details</h3>
              <button
                onClick={() => setSelectedTxDetail(null)}
                className="p-1 rounded-lg text-[#888] hover:text-[#f2f2f2]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#555] block font-semibold">Amount</span>
              <span
                className={`text-3xl font-mono ${
                  selectedTxDetail.type === 'income'
                    ? 'text-[#c5a059]'
                    : selectedTxDetail.type === 'expense'
                    ? 'text-[#f2f2f2]'
                    : 'text-indigo-300'
                }`}
              >
                {formatCurrency(selectedTxDetail.amount, currency)}
              </span>
            </div>

            <div className="bg-[#0a0a0a] p-4 rounded-2xl border border-[#222] space-y-2.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#666]">Title:</span>
                <span className="font-semibold text-[#f2f2f2]">{selectedTxDetail.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">Type:</span>
                <span className="font-semibold uppercase text-[#c5a059]">{selectedTxDetail.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">Wallet:</span>
                <span className="font-semibold text-[#f2f2f2]">
                  {accounts.find((a) => a.id === selectedTxDetail.accountId)?.name}
                </span>
              </div>
              {selectedTxDetail.targetAccountId && (
                <div className="flex justify-between">
                  <span className="text-[#666]">Destination:</span>
                  <span className="font-semibold text-[#f2f2f2]">
                    {accounts.find((a) => a.id === selectedTxDetail.targetAccountId)?.name}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#666]">Timestamp:</span>
                <span className="font-semibold text-[#888]">{formatDate(selectedTxDetail.timestamp)}</span>
              </div>
              {selectedTxDetail.note && (
                <div className="pt-2 border-t border-[#1a1a1a]">
                  <span className="text-[#555] block mb-1">Note:</span>
                  <p className="text-[#aaa] italic">{selectedTxDetail.note}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(selectedTxDetail.id)}
                className="flex-1 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold hover:bg-rose-500/20 cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedTxDetail(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#222] text-[#e0e0e0] text-xs font-semibold hover:bg-[#333] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
