import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { AccountType, CurrencyCode } from '../types';
import { WalletStorageManager } from '../storage/walletStorage';
import { AVAILABLE_ICONS, IconRenderer } from './IconRenderer';
import { formatCurrency } from '../utils/formatters';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
}

const ACCOUNT_TYPES: { type: AccountType; label: string }[] = [
  { type: 'bank', label: 'Bank Account' },
  { type: 'wallet', label: 'E-Wallet / Digital' },
  { type: 'cash', label: 'Physical Cash' },
  { type: 'credit', label: 'Credit Card' },
  { type: 'investment', label: 'Investment Portfolio' },
];

const PRESET_COLORS = [
  '#005CE6', // GCash Blue
  '#002B66', // BDO Navy
  '#10B981', // Cash Emerald
  '#8B5CF6', // Maya Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#14B8A6', // Teal
  '#3B82F6', // Sky Blue
  '#EC4899', // Pink
  '#6366F1', // Indigo
];

export const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, currency }) => {
  const [name, setName] = useState('');
  const [balanceStr, setBalanceStr] = useState('');
  const [type, setType] = useState<AccountType>('bank');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [iconName, setIconName] = useState('Building2');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const initialBalance = parseFloat(balanceStr) || 0;
    WalletStorageManager.addAccount({
      name: name.trim(),
      balance: initialBalance,
      initialBalance,
      type,
      color,
      iconName,
    });

    setName('');
    setBalanceStr('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#141414] border border-[#222] rounded-3xl w-full max-w-md p-6 text-[#e0e0e0] shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#222]">
          <h3 className="text-lg font-serif text-[#f2f2f2] uppercase tracking-wider">Add Account / Wallet</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#888] hover:text-[#f2f2f2] hover:bg-[#222] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1">Account or Bank Name</label>
            <input
              type="text"
              placeholder="e.g. Maya, UnionBank, BPI, PayPal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222] focus:border-[#c5a059] focus:outline-none text-xs text-[#f2f2f2] placeholder-[#555]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1">
              Starting Balance ({formatCurrency(0, currency).slice(0, 1)})
            </label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={balanceStr}
              onChange={(e) => setBalanceStr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222] focus:border-[#c5a059] focus:outline-none text-xs text-[#f2f2f2] placeholder-[#555] font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1.5">Account Type</label>
            <div className="grid grid-cols-2 gap-2">
              {ACCOUNT_TYPES.map((t) => (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setType(t.type)}
                  className={`px-3 py-2 rounded-xl text-xs text-left border transition-all ${
                    type === t.type
                      ? 'bg-[#181818] border-[#c5a059] text-[#c5a059] font-medium'
                      : 'bg-[#0a0a0a] border-[#222] text-[#888] hover:border-[#333]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1.5">Theme Color</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1.5">Icon</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-[#0a0a0a] rounded-xl border border-[#222]">
              {AVAILABLE_ICONS.slice(0, 16).map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setIconName(icon)}
                  className={`p-2 rounded-lg transition-colors ${
                    iconName === icon ? 'bg-[#c5a059]/20 text-[#c5a059]' : 'text-[#666] hover:text-[#e0e0e0]'
                  }`}
                >
                  <IconRenderer name={icon} size={18} />
                </button>
              ))}
            </div>
          </div>

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
              className="flex-1 py-3 rounded-xl bg-[#c5a059] text-black font-bold text-xs uppercase tracking-widest transition-colors shadow-[0_4px_15px_rgba(197,160,89,0.2)] hover:bg-[#d8b068] cursor-pointer"
            >
              Save Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
