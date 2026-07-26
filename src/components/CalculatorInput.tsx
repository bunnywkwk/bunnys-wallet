import React, { useState } from 'react';
import {
  Calculator as CalcIcon,
  PlusCircle,
  Delete,
  CheckCircle2,
  Calendar,
  Tag,
  Wallet,
  ArrowRightLeft,
  Plus,
} from 'lucide-react';
import { Account, Category, CurrencyCode, TransactionType } from '../types';
import { WalletStorageManager } from '../storage/walletStorage';
import { evaluateExpression } from '../utils/calculator';
import { IconRenderer } from './IconRenderer';
import { formatCurrency } from '../utils/formatters';

interface CalculatorInputProps {
  accounts: Account[];
  categories: Category[];
  currency: CurrencyCode;
  onOpenAddCategory: () => void;
  onTransactionAdded?: () => void;
}

export const CalculatorInput: React.FC<CalculatorInputProps> = ({
  accounts,
  categories,
  currency,
  onOpenAddCategory,
  onTransactionAdded,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [expression, setExpression] = useState('');
  const [itemName, setItemName] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');
  const [selectedTargetAccountId, setSelectedTargetAccountId] = useState(
    accounts[1]?.id || accounts[0]?.id || ''
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [timestamp, setTimestamp] = useState(() => new Date().toISOString().slice(0, 16)); // YYYY-MM-DDTHH:mm
  const [note, setNote] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Filter categories by type
  const availableCategories = categories.filter((c) =>
    type === 'income' ? c.type === 'income' : c.type === 'expense'
  );

  // Track category count to auto-select newly added category
  const prevCatCountRef = React.useRef(categories.length);

  React.useEffect(() => {
    if (categories.length > prevCatCountRef.current) {
      // New category added! Select the newest category if it matches the current type
      const newest = categories[categories.length - 1];
      if (newest && (type === 'income' ? newest.type === 'income' : newest.type === 'expense')) {
        setSelectedCategoryId(newest.id);
      }
    } else if (!availableCategories.some((c) => c.id === selectedCategoryId)) {
      if (availableCategories.length > 0) {
        setSelectedCategoryId(availableCategories[0].id);
      }
    }
    prevCatCountRef.current = categories.length;
  }, [categories, type]);

  // Keep accounts selection valid when accounts update
  React.useEffect(() => {
    if (accounts.length > 0) {
      if (!selectedAccountId || !accounts.some((a) => a.id === selectedAccountId)) {
        setSelectedAccountId(accounts[0].id);
      }
      if (!selectedTargetAccountId || !accounts.some((a) => a.id === selectedTargetAccountId)) {
        setSelectedTargetAccountId(accounts[1]?.id || accounts[0]?.id);
      }
    }
  }, [accounts, selectedAccountId, selectedTargetAccountId]);

  const currencySymbol = formatCurrency(0, currency).slice(0, 1);

  // Evaluate current expression live
  const evaluatedAmount = evaluateExpression(expression);

  // Keypad actions
  const handleKeyClick = (val: string) => {
    if (val === 'C') {
      setExpression('');
      return;
    }
    if (val === '⌫') {
      setExpression((prev) => prev.slice(0, -1));
      return;
    }
    if (val === '=') {
      if (evaluatedAmount !== null) {
        setExpression(evaluatedAmount.toString());
      }
      return;
    }

    // Operator handling
    const isOperator = ['+', '-', '×', '÷'].includes(val);
    const lastChar = expression.slice(-1);
    const lastIsOperator = ['+', '-', '×', '÷'].includes(lastChar);

    if (isOperator && lastIsOperator) {
      setExpression((prev) => prev.slice(0, -1) + val);
      return;
    }

    setExpression((prev) => prev + val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = evaluatedAmount || parseFloat(expression);
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
      alert('Please enter a valid amount using the keypad.');
      return;
    }

    if (!selectedAccountId) {
      alert('Please select an account.');
      return;
    }

    const nameToUse =
      itemName.trim() ||
      categories.find((c) => c.id === selectedCategoryId)?.name ||
      (type === 'income' ? 'Income' : 'Expense');

    WalletStorageManager.addTransaction({
      amount: finalAmount,
      type,
      accountId: selectedAccountId,
      targetAccountId: type === 'transfer' ? selectedTargetAccountId : undefined,
      categoryId: selectedCategoryId || availableCategories[0]?.id || 'cat_misc_exp',
      name: nameToUse,
      timestamp: new Date(timestamp).toISOString(),
      note: note.trim() || undefined,
    });

    // Reset keypad and show feedback
    setExpression('');
    setItemName('');
    setNote('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2500);

    if (onTransactionAdded) onTransactionAdded();
  };

  const keypadButtons = [
    '7', '8', '9', '÷',
    '4', '5', '6', '×',
    '1', '2', '3', '-',
    '0', '.', '⌫', '+',
    'C', '=',
  ];

  return (
    <section className="bg-[#141414] border border-[#222] rounded-3xl p-6 shadow-2xl space-y-5">
      {/* Section Header & Type Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/30">
            <CalcIcon size={18} />
          </div>
          <div>
            <h2 className="text-sm font-serif text-[#f2f2f2]">Calculator Input</h2>
            <p className="text-[10px] uppercase tracking-widest text-[#555]">Rapid entry & formula pad</p>
          </div>
        </div>

        {/* Expense vs Income vs Transfer Segmented Buttons */}
        <div className="flex bg-[#0a0a0a] p-1 rounded-full border border-[#222]">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full transition-all ${
              type === 'expense'
                ? 'border border-[#c5a059] text-[#c5a059] bg-[#c5a059]/10 shadow-[0_0_10px_rgba(197,160,89,0.1)] font-bold'
                : 'border border-transparent text-[#555] hover:text-[#888]'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full transition-all ${
              type === 'income'
                ? 'border border-[#c5a059] text-[#c5a059] bg-[#c5a059]/10 shadow-[0_0_10px_rgba(197,160,89,0.1)] font-bold'
                : 'border border-transparent text-[#555] hover:text-[#888]'
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setType('transfer')}
            className={`text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full transition-all ${
              type === 'transfer'
                ? 'border border-[#c5a059] text-[#c5a059] bg-[#c5a059]/10 shadow-[0_0_10px_rgba(197,160,89,0.1)] font-bold'
                : 'border border-transparent text-[#555] hover:text-[#888]'
            }`}
          >
            Transfer
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount & Keypad Box */}
        <div className="bg-[#0a0a0a] p-5 rounded-2xl border border-[#222] space-y-3">
          <div className="flex items-baseline justify-between text-right">
            <span className="text-[10px] uppercase tracking-widest text-[#555]">Amount Input</span>
            <span className="text-[11px] text-[#888] font-mono">
              {expression ? `Formula: ${expression}` : 'Tap keys'}
            </span>
          </div>

          <div className="text-center py-2 border-b border-[#222]">
            <p className="text-4xl sm:text-5xl font-mono text-[#f2f2f2]">
              <span className="text-[#c5a059] text-2xl mr-1">{currencySymbol}</span>
              {expression || '0.00'}
            </p>
            {evaluatedAmount !== null && expression && expression !== evaluatedAmount.toString() && (
              <span className="block text-xs font-mono text-[#c5a059] mt-1">
                = {currencySymbol}
                {evaluatedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {keypadButtons.map((btn) => {
              const isOp = ['+', '-', '×', '÷', '='].includes(btn);
              const isClear = btn === 'C' || btn === '⌫';

              return (
                <button
                  key={btn}
                  type="button"
                  onClick={() => handleKeyClick(btn)}
                  className={`py-3 rounded-xl text-lg font-light transition-all active:scale-95 ${
                    btn === '='
                      ? 'col-span-3 bg-[#c5a059] text-black font-bold uppercase tracking-widest hover:brightness-110 shadow-[0_4px_15px_rgba(197,160,89,0.2)]'
                      : isOp
                      ? 'bg-[#181818] hover:bg-[#222] text-[#c5a059] border border-[#222]'
                      : isClear
                      ? 'bg-[#181818] hover:bg-[#222] text-red-500 border border-[#222]'
                      : 'bg-[#141414] hover:bg-[#222] text-[#f2f2f2] border border-[#1a1a1a]'
                  }`}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Itemization Name & Account Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1">
              Description
            </label>
            <input
              type="text"
              placeholder={type === 'income' ? 'Salary, Freelance' : 'SM Grocery, Gas, Coffee'}
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222] focus:border-[#c5a059] focus:outline-none text-xs text-[#f2f2f2] placeholder-[#555]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1 flex items-center gap-1">
              <Wallet size={11} className="text-[#c5a059]" />
              <span>{type === 'transfer' ? 'From Wallet' : 'Wallet Account'}</span>
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222] text-xs text-[#f2f2f2] focus:border-[#c5a059] focus:outline-none cursor-pointer"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id} className="bg-[#141414]">
                  {acc.name} ({formatCurrency(acc.balance, currency)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transfer Destination Account Selector if Transfer mode */}
        {type === 'transfer' && (
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1 flex items-center gap-1">
              <ArrowRightLeft size={11} className="text-[#c5a059]" />
              <span>To Wallet</span>
            </label>
            <select
              value={selectedTargetAccountId}
              onChange={(e) => setSelectedTargetAccountId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222] text-xs text-[#f2f2f2] focus:border-[#c5a059] focus:outline-none cursor-pointer"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id} disabled={acc.id === selectedAccountId} className="bg-[#141414]">
                  {acc.name} ({formatCurrency(acc.balance, currency)})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Dynamic Category Selector Grid */}
        {type !== 'transfer' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-widest text-[#555] flex items-center gap-1">
                <Tag size={11} className="text-[#c5a059]" />
                <span>Category</span>
              </label>
              <button
                type="button"
                onClick={onOpenAddCategory}
                className="text-[10px] uppercase tracking-widest text-[#c5a059] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Plus size={12} />
                <span>+ Add Category</span>
              </button>
            </div>

            {/* Quick Dropdown Selector for All Categories */}
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222] text-xs text-[#f2f2f2] focus:border-[#c5a059] focus:outline-none cursor-pointer"
            >
              {availableCategories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#141414]">
                  {cat.name} ({cat.type === 'expense' ? 'Expense' : 'Income'})
                </option>
              ))}
            </select>

            {/* Quick Tap Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
              {availableCategories.map((cat) => {
                const isCatSelected = selectedCategoryId === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs whitespace-nowrap border transition-all cursor-pointer ${
                      isCatSelected
                        ? 'bg-[#181818] border-[#c5a059] text-[#c5a059] font-medium shadow-[0_0_10px_rgba(197,160,89,0.15)]'
                        : 'bg-[#0a0a0a] border-[#222] text-[#888] hover:border-[#333]'
                    }`}
                  >
                    <IconRenderer name={cat.iconName} size={14} color={cat.color || '#c5a059'} />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Timestamp & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1 flex items-center gap-1">
              <Calendar size={11} />
              <span>Timestamp</span>
            </label>
            <input
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0a0a0a] border border-[#222] text-xs text-[#f2f2f2] focus:border-[#c5a059] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-1">Note</label>
            <input
              type="text"
              placeholder="Receipt #, optional note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0a0a0a] border border-[#222] text-xs text-[#f2f2f2] placeholder-[#555] focus:border-[#c5a059] focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Primary Button */}
        <button
          type="submit"
          className="w-full bg-[#c5a059] text-black font-bold text-xs uppercase tracking-[0.2em] py-4 rounded-xl shadow-[0_8px_20px_rgba(197,160,89,0.2)] hover:bg-[#d8b068] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <PlusCircle size={16} />
          <span>
            Record {type === 'expense' ? 'Expense' : type === 'income' ? 'Income' : 'Transfer'}
          </span>
        </button>

        {showSuccessToast && (
          <div className="p-3 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] text-xs font-medium flex items-center justify-center gap-2 animate-in fade-in duration-200 font-mono">
            <CheckCircle2 size={16} />
            <span>Transaction recorded in Vault!</span>
          </div>
        )}
      </form>
    </section>
  );
};
