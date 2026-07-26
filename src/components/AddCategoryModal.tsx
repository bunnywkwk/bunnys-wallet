import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { WalletStorageManager } from '../storage/walletStorage';
import { AVAILABLE_ICONS, IconRenderer } from './IconRenderer';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'expense' | 'income';
}

const PRESET_COLORS = [
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#6366F1', // Indigo
];

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'expense',
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'expense' | 'income'>(defaultType);
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [iconName, setIconName] = useState('Tag');
  const [budgetStr, setBudgetStr] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const budgetLimit = type === 'expense' && budgetStr ? parseFloat(budgetStr) : undefined;

    WalletStorageManager.addCategory({
      name: name.trim(),
      type,
      color,
      iconName,
      budgetLimit,
    });

    setName('');
    setBudgetStr('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#141414] border border-[#222] rounded-3xl w-full max-w-md p-6 text-[#e0e0e0] shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#222]">
          <h3 className="text-lg font-serif text-[#f2f2f2] uppercase tracking-wider">Add Category</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#888] hover:text-[#f2f2f2] hover:bg-[#222] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex bg-[#0a0a0a] p-1 rounded-full border border-[#222]">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-medium transition-colors ${
                type === 'expense'
                  ? 'bg-[#c5a059]/20 border border-[#c5a059]/30 text-[#c5a059] font-bold'
                  : 'text-[#666] hover:text-[#888]'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-medium transition-colors ${
                type === 'income'
                  ? 'bg-[#c5a059]/20 border border-[#c5a059]/30 text-[#c5a059] font-bold'
                  : 'text-[#666] hover:text-[#888]'
              }`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1">Category Name</label>
            <input
              type="text"
              placeholder="e.g. Pet Care, Gaming, Side Hustle"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222] focus:border-[#c5a059] focus:outline-none text-xs text-[#f2f2f2] placeholder-[#555]"
            />
          </div>

          {type === 'expense' && (
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1">
                Monthly Budget Limit
              </label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={budgetStr}
                onChange={(e) => setBudgetStr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222] focus:border-[#c5a059] focus:outline-none text-xs text-[#f2f2f2] placeholder-[#555] font-mono"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1.5">Color</label>
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
              {AVAILABLE_ICONS.map((icon) => (
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
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
