import React, { useState } from 'react';
import {
  PieChart as PieChartIcon,
  BarChart3,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Calendar,
  CheckCircle,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Category, CurrencyCode, RecurringSubscription, Transaction } from '../types';
import { WalletStorageManager } from '../storage/walletStorage';
import { IconRenderer } from './IconRenderer';
import { formatCurrency, formatDateShort } from '../utils/formatters';

interface AnalyticsDashboardProps {
  transactions: Transaction[];
  categories: Category[];
  recurring: RecurringSubscription[];
  currency: CurrencyCode;
  privacyMode: boolean;
  onSelectCategoryFilter?: (categoryId: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  transactions,
  categories,
  recurring,
  currency,
  privacyMode,
  onSelectCategoryFilter,
}) => {
  const [timeframe, setTimeframe] = useState<'month' | 'all'>('month');

  // Filter transactions by timeframe
  const now = new Date();
  const filteredTransactions = transactions.filter((t) => {
    if (timeframe === 'month') {
      const txDate = new Date(t.timestamp);
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpense;

  // Category Expense Aggregation
  const categoryTotals: { [catId: string]: number } = {};
  filteredTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryTotals[t.categoryId] = (categoryTotals[t.categoryId] || 0) + t.amount;
    });

  const categoryPieData = Object.keys(categoryTotals).map((catId) => {
    const cat = categories.find((c) => c.id === catId);
    return {
      id: catId,
      name: cat?.name || 'Other',
      value: categoryTotals[catId],
      color: cat?.color || '#6B7280',
    };
  });

  // Bar Chart Data (Grouped by date)
  const dateMap: { [dateKey: string]: { date: string; income: number; expense: number } } = {};
  filteredTransactions.forEach((t) => {
    const dateKey = formatDateShort(t.timestamp);
    if (!dateMap[dateKey]) {
      dateMap[dateKey] = { date: dateKey, income: 0, expense: 0 };
    }
    if (t.type === 'income') dateMap[dateKey].income += t.amount;
    if (t.type === 'expense') dateMap[dateKey].expense += t.amount;
  });

  const barChartData = Object.values(dateMap).slice(-7); // Last 7 days

  const handlePaySubscription = (sub: RecurringSubscription) => {
    WalletStorageManager.addTransaction({
      amount: sub.amount,
      type: 'expense',
      accountId: sub.accountId,
      categoryId: sub.categoryId,
      name: `Recurring: ${sub.name}`,
      timestamp: new Date().toISOString(),
      note: `Auto-paid ${sub.frequency} subscription`,
    });
    alert(`Logged payment for ${sub.name}!`);
  };

  return (
    <section className="bg-[#111] border border-[#222] rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Section Title & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#141414] text-[#c5a059] border border-[#c5a059]/30">
            <BarChart3 size={18} />
          </div>
          <div>
            <h2 className="text-lg font-serif text-[#f2f2f2]">Financial Analytics</h2>
            <p className="text-[10px] uppercase tracking-widest text-[#555]">Expense distribution & cash flow trends</p>
          </div>
        </div>

        <div className="flex bg-[#0a0a0a] p-1 rounded-full border border-[#222]">
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest transition-colors ${
              timeframe === 'month'
                ? 'bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40 font-bold'
                : 'text-[#666] hover:text-[#888]'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeframe('all')}
            className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest transition-colors ${
              timeframe === 'all'
                ? 'bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40 font-bold'
                : 'text-[#666] hover:text-[#888]'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#181818] border-l-2 border-[#c5a059] border-y border-r border-[#222]">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#c5a059] uppercase tracking-widest">
            <TrendingUp size={14} />
            <span>Total Income</span>
          </div>
          <span className="text-lg font-mono text-[#f2f2f2] block mt-1">
            {privacyMode ? '••••••' : formatCurrency(totalIncome, currency)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#181818] border-l-2 border-[#888] border-y border-r border-[#222]">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#888] uppercase tracking-widest">
            <TrendingDown size={14} />
            <span>Total Expense</span>
          </div>
          <span className="text-lg font-mono text-[#f2f2f2] block mt-1">
            {privacyMode ? '••••••' : formatCurrency(totalExpense, currency)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#181818] border-l-2 border-[#444] border-y border-r border-[#222]">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#aaa] uppercase tracking-widest">
            <Zap size={14} />
            <span>Net Flow</span>
          </div>
          <span
            className={`text-lg font-mono block mt-1 ${
              netSavings >= 0 ? 'text-[#c5a059]' : 'text-rose-400'
            }`}
          >
            {privacyMode ? '••••••' : formatCurrency(netSavings, currency, true)}
          </span>
        </div>
      </div>

      {/* Bar Chart: Cash Flow Trends */}
      <div className="p-5 rounded-2xl bg-[#141414] border border-[#222] space-y-3">
        <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-[0.2em]">
          Daily Flow Trends
        </h3>
        {barChartData.length > 0 ? (
          <div className="h-48 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <XAxis dataKey="date" stroke="#555" fontSize={10} tickLine={false} />
                <YAxis stroke="#555" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141414', borderColor: '#333', borderRadius: '12px', color: '#e0e0e0' }}
                  labelStyle={{ color: '#888', fontFamily: 'JetBrains Mono' }}
                />
                <Bar dataKey="income" name="Income" fill="#c5a059" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-xs text-[#555] py-6 text-center italic">No transactions recorded for this period.</p>
        )}
      </div>

      {/* Category Breakdown & Budget Limits */}
      <div className="flex flex-col gap-5 xl:grid xl:grid-cols-2">
        {/* Donut Chart */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#222] space-y-3">
          <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-[0.2em] flex items-center gap-1.5">
            <PieChartIcon size={14} className="text-[#c5a059]" />
            <span>Expense Distribution</span>
          </h3>

          {categoryPieData.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="h-40 w-40 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryPieData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={65}
                      paddingAngle={3}
                    >
                      {categoryPieData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color || '#c5a059'} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 w-full text-xs max-h-40 overflow-y-auto pr-1">
                {categoryPieData.map((item) => {
                  const pct = totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(1) : '0';
                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectCategoryFilter?.(item.id)}
                      className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#181818] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[#e0e0e0] font-medium">{item.name}</span>
                      </div>
                      <span className="font-mono text-[#888]">
                        {pct}% ({privacyMode ? '••' : formatCurrency(item.value, currency)})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#555] py-8 text-center italic">No expenses logged in this period.</p>
          )}
        </div>

        {/* Budget Limits Tracker */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#222] space-y-3">
          <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-[0.2em] flex items-center gap-1.5">
            <AlertCircle size={14} className="text-[#c5a059]" />
            <span>Monthly Category Budgets</span>
          </h3>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 text-xs">
            {categories
              .filter((c) => c.type === 'expense' && c.budgetLimit && c.budgetLimit > 0)
              .map((cat) => {
                const spent = categoryTotals[cat.id] || 0;
                const limit = cat.budgetLimit || 1;
                const pct = Math.min(100, Math.round((spent / limit) * 100));
                const isOver = spent > limit;

                return (
                  <div key={cat.id} className="p-3 rounded-xl bg-[#181818] border border-[#222] space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <IconRenderer name={cat.iconName} size={14} color={cat.color || '#c5a059'} />
                        <span className="font-medium text-[#f2f2f2] truncate">{cat.name}</span>
                      </div>
                      <span className="text-[11px] text-[#888] font-mono shrink-0">
                        {privacyMode ? '••' : formatCurrency(spent, currency)} / {formatCurrency(limit, currency)}
                      </span>
                    </div>

                    <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all rounded-full ${
                          isOver ? 'bg-rose-500' : 'bg-[#c5a059]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    {isOver && (
                      <p className="text-[10px] text-rose-400 font-medium">
                        ⚠️ Over limit by {formatCurrency(spent - limit, currency)}
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Recurring Subscriptions & Scheduled Bills Tracker */}
      <div className="p-5 rounded-2xl bg-[#141414] border border-[#222] space-y-3">
        <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-[0.2em] flex items-center gap-1.5">
          <Calendar size={14} className="text-[#c5a059]" />
          <span>Subscriptions & Recurring Bills</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {recurring.map((sub) => (
            <div
              key={sub.id}
              className="p-3.5 rounded-xl bg-[#181818] border border-[#222] flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="text-xs font-medium text-[#f2f2f2] block">{sub.name}</span>
                <span className="text-[10px] text-[#666] uppercase tracking-wider">
                  Due: {sub.nextDueDate} ({sub.frequency})
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#222]">
                <span className="text-xs font-mono text-[#c5a059]">
                  {formatCurrency(sub.amount, currency)}
                </span>
                <button
                  onClick={() => handlePaySubscription(sub)}
                  className="px-2.5 py-1 rounded-lg bg-[#c5a059]/10 hover:bg-[#c5a059]/20 text-[#c5a059] text-[10px] uppercase tracking-widest font-semibold transition-colors flex items-center gap-1 cursor-pointer border border-[#c5a059]/30"
                >
                  <CheckCircle size={12} />
                  Log
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
