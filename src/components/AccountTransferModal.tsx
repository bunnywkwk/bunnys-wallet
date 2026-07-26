import React, { useState } from 'react';
import { X, ArrowRightLeft } from 'lucide-react';
import { Account, CurrencyCode } from '../types';
import { WalletStorageManager } from '../storage/walletStorage';
import { formatCurrency } from '../utils/formatters';

interface AccountTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  currency: CurrencyCode;
}

export const AccountTransferModal: React.FC<AccountTransferModalProps> = ({
  isOpen,
  onClose,
  accounts,
  currency,
}) => {
  const [sourceAccId, setSourceAccId] = useState('');
  const [targetAccId, setTargetAccId] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [feeStr, setFeeStr] = useState('');
  const [note, setNote] = useState('');

  React.useEffect(() => {
    if (isOpen && accounts.length > 0) {
      if (!sourceAccId || !accounts.some((a) => a.id === sourceAccId)) {
        setSourceAccId(accounts[0].id);
      }
      if (!targetAccId || !accounts.some((a) => a.id === targetAccId) || targetAccId === accounts[0]?.id) {
        setTargetAccId(accounts[1]?.id || accounts[0]?.id);
      }
    }
  }, [isOpen, accounts]);

  if (!isOpen) return null;

  const sourceAccount = accounts.find((a) => a.id === sourceAccId);
  const targetAccount = accounts.find((a) => a.id === targetAccId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0 || !sourceAccId || !targetAccId || sourceAccId === targetAccId) {
      return;
    }

    const transferFee = parseFloat(feeStr) || 0;

    WalletStorageManager.addTransaction({
      amount,
      type: 'transfer',
      accountId: sourceAccId,
      targetAccountId: targetAccId,
      categoryId: 'cat_transfer',
      name: `Transfer: ${sourceAccount?.name || 'Account'} → ${targetAccount?.name || 'Account'}`,
      timestamp: new Date().toISOString(),
      transferFee,
      note: note.trim() || undefined,
    });

    setAmountStr('');
    setFeeStr('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#141414] border border-[#222] rounded-3xl w-full max-w-md p-6 text-[#e0e0e0] shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#222]">
          <div className="flex items-center gap-2 text-[#c5a059]">
            <ArrowRightLeft size={18} />
            <h3 className="text-lg font-serif text-[#f2f2f2] uppercase tracking-wider">Account Transfer</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#888] hover:text-[#f2f2f2] hover:bg-[#222] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1">From Wallet (Source)</label>
              <select
                value={sourceAccId}
                onChange={(e) => setSourceAccId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222] text-xs text-[#f2f2f2] focus:border-[#c5a059] focus:outline-none cursor-pointer"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id} className="bg-[#141414]">
                    {acc.name} ({formatCurrency(acc.balance, currency)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1">To Wallet (Destination)</label>
              <select
                value={targetAccId}
                onChange={(e) => setTargetAccId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222] text-xs text-[#f2f2f2] focus:border-[#c5a059] focus:outline-none cursor-pointer"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id} disabled={acc.id === sourceAccId} className="bg-[#141414]">
                    {acc.name} ({formatCurrency(acc.balance, currency)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1">Transfer Amount</label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222] focus:border-[#c5a059] focus:outline-none text-xs text-[#f2f2f2] placeholder-[#555] font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1">Fee (Optional)</label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={feeStr}
                onChange={(e) => setFeeStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222] focus:border-[#c5a059] focus:outline-none text-xs text-[#f2f2f2] placeholder-[#555] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1">Note (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Cash-in fee or monthly savings transfer"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222] focus:border-[#c5a059] focus:outline-none text-xs text-[#f2f2f2] placeholder-[#555]"
            />
          </div>

          {sourceAccId === targetAccId && (
            <p className="text-xs text-rose-400">Source and target accounts must be different.</p>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#222] text-[#888] hover:text-[#f2f2f2] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sourceAccId === targetAccId || !amountStr}
              className="flex-1 py-3 rounded-xl bg-[#c5a059] text-black font-bold text-xs uppercase tracking-widest transition-colors shadow-[0_4px_15px_rgba(197,160,89,0.2)] hover:bg-[#d8b068] disabled:opacity-50 cursor-pointer"
            >
              Confirm Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
