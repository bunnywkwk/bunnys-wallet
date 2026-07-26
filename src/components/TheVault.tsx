import React, { useState } from 'react';
import { Plus, Edit2, Check, ArrowRightLeft, ShieldCheck, Wallet } from 'lucide-react';
import { Account, CurrencyCode } from '../types';
import { WalletStorageManager } from '../storage/walletStorage';
import { IconRenderer } from './IconRenderer';
import { formatCurrency } from '../utils/formatters';

interface TheVaultProps {
  accounts: Account[];
  currency: CurrencyCode;
  privacyMode: boolean;
  onOpenAddAccount: () => void;
  onOpenTransfer: () => void;
  onSelectAccountFilter?: (accountId: string) => void;
  selectedAccountId?: string | null;
}

export const TheVault: React.FC<TheVaultProps> = ({
  accounts,
  currency,
  privacyMode,
  onOpenAddAccount,
  onOpenTransfer,
  onSelectAccountFilter,
  selectedAccountId,
}) => {
  const [editingAccId, setEditingAccId] = useState<string | null>(null);
  const [editInitialBalance, setEditInitialBalance] = useState('');

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const startEditing = (acc: Account) => {
    setEditingAccId(acc.id);
    setEditInitialBalance(acc.initialBalance.toString());
  };

  const saveInitialBalance = (acc: Account) => {
    const newInitial = parseFloat(editInitialBalance);
    if (!isNaN(newInitial)) {
      // Adjustment diff
      const diff = newInitial - acc.initialBalance;
      WalletStorageManager.updateAccount(acc.id, {
        initialBalance: newInitial,
        balance: acc.balance + diff,
      });
    }
    setEditingAccId(null);
  };

  return (
    <section className="bg-[#111] border border-[#222] rounded-3xl p-6 shadow-2xl space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#222] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#141414] text-[#c5a059] border border-[#c5a059]/30">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-widest text-[#888] font-bold">Accounts</h2>
            <p className="text-[10px] text-[#555] uppercase tracking-wider">Balances, starting amounts & wallets</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTransfer}
            className="px-3 py-1.5 rounded-xl bg-[#141414] border border-[#333] hover:border-[#c5a059]/40 text-[#888] hover:text-[#c5a059] text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <ArrowRightLeft size={13} />
            <span className="uppercase tracking-widest text-[10px]">Transfer</span>
          </button>
          <button
            onClick={onOpenAddAccount}
            className="px-3 py-1.5 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/40 hover:bg-[#c5a059]/20 text-[#c5a059] text-xs font-semibold uppercase tracking-widest transition-colors flex items-center gap-1"
          >
            <Plus size={13} />
            <span className="text-[10px]">+ Add</span>
          </button>
        </div>
      </div>

      {/* Global Total Balance Overview Card */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-[#c5a059]/30 flex items-center justify-between shadow-[0_0_15px_rgba(197,160,89,0.05)]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-semibold block">
            Aggregated Total Cash
          </span>
          <span className="text-2xl font-light text-[#c5a059] tracking-tight block mt-0.5 font-mono">
            {privacyMode ? '••••••••' : formatCurrency(totalBalance, currency)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-[#666] block">Active Accounts</span>
          <span className="text-xs font-bold text-[#e0e0e0]">{accounts.length} Wallets</span>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {accounts.map((acc) => {
          const isSelected = selectedAccountId === acc.id;

          return (
            <div
              key={acc.id}
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#141414] border-[#c5a059] ring-1 ring-[#c5a059]/40 shadow-[0_0_15px_rgba(197,160,89,0.1)]'
                  : 'bg-[#141414] border-[#222] hover:border-[#333]'
              }`}
            >
              {/* Account Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center border border-[#222] shrink-0"
                    style={{ backgroundColor: `${acc.color}15`, color: acc.color || '#c5a059' }}
                  >
                    <IconRenderer name={acc.iconName || 'Wallet'} size={18} color={acc.color || '#c5a059'} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-medium text-[#f2f2f2] flex items-center gap-1.5 truncate">
                      <span className="truncate">{acc.name}</span>
                      {acc.isDefault && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#222] text-[#888] font-normal uppercase tracking-wider shrink-0">
                          Primary
                        </span>
                      )}
                    </h3>
                    <span className="text-[10px] text-[#666] uppercase tracking-wider font-medium block">
                      {acc.type}
                    </span>
                  </div>
                </div>

                {onSelectAccountFilter && (
                  <button
                    onClick={() => onSelectAccountFilter(isSelected ? '' : acc.id)}
                    className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-lg border transition-colors shrink-0 ml-1 ${
                      isSelected
                        ? 'bg-[#c5a059]/20 border-[#c5a059]/50 text-[#c5a059]'
                        : 'bg-[#1a1a1a] border-[#222] text-[#666] hover:text-[#888]'
                    }`}
                  >
                    {isSelected ? 'Filtering' : 'Logs'}
                  </button>
                )}
              </div>

              {/* Current Live Balance */}
              <div className="mt-3">
                <span className="text-[10px] text-[#666] uppercase tracking-wider font-semibold block">Balance</span>
                <span className="text-lg font-light text-[#f2f2f2] font-mono tracking-tight block">
                  {privacyMode ? '••••••••' : formatCurrency(acc.balance, currency)}
                </span>
              </div>

              {/* Starting Balance Row with Inline Edit */}
              <div className="mt-2 pt-2 border-t border-[#1a1a1a] flex items-center justify-between text-[11px]">
                <span className="text-[#666]">Starting Amount:</span>
                {editingAccId === acc.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="any"
                      value={editInitialBalance}
                      onChange={(e) => setEditInitialBalance(e.target.value)}
                      className="w-20 px-1.5 py-0.5 rounded bg-[#0a0a0a] border border-[#c5a059] text-xs text-[#f2f2f2] font-mono"
                    />
                    <button
                      onClick={() => saveInitialBalance(acc)}
                      className="p-1 rounded bg-[#c5a059] text-black font-bold"
                    >
                      <Check size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[#888]">
                      {privacyMode ? '••••' : formatCurrency(acc.initialBalance, currency)}
                    </span>
                    <button
                      onClick={() => startEditing(acc)}
                      className="p-1 rounded bg-[#1e1e1e] border border-[#333] text-[#888] hover:text-[#c5a059] transition-colors"
                      title="Edit starting balance"
                    >
                      <Edit2 size={11} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
