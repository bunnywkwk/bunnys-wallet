import React, { useState } from 'react';
import { X, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { Account, Category, CurrencyCode, FinancialInsight, Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';

interface AIInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  currency: CurrencyCode;
}

export const AIInsightsModal: React.FC<AIInsightsModalProps> = ({
  isOpen,
  onClose,
  transactions,
  accounts,
  categories,
  currency,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insight, setInsight] = useState<FinancialInsight | null>(null);

  if (!isOpen) return null;

  const currencySymbol = formatCurrency(0, currency).slice(0, 1);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions,
          accounts,
          categories,
          currencySymbol,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details || 'Failed to fetch AI insights');
      }

      setInsight(data.insight);
    } catch (err: any) {
      setError(err?.message || 'Error generating insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#141414] border border-[#222] rounded-3xl w-full max-w-lg p-6 text-[#e0e0e0] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#222]">
          <div className="flex items-center gap-2 text-[#c5a059]">
            <Sparkles size={18} className="animate-pulse" />
            <h3 className="text-lg font-serif text-[#f2f2f2] uppercase tracking-wider">Financial Insights</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#888] hover:text-[#f2f2f2] hover:bg-[#222] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {!insight && !loading && !error && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
              <Sparkles size={28} />
            </div>
            <div>
              <h4 className="font-serif text-[#f2f2f2]">AI Intelligence Report</h4>
              <p className="text-xs text-[#888] mt-1 max-w-sm mx-auto">
                Gemini AI will analyze cash flows across {accounts.length} wallets and {transactions.length} recent transactions to evaluate your financial wellness, identify expense spikes, and forecast monthly savings.
              </p>
            </div>
            <button
              onClick={fetchInsights}
              className="px-6 py-3 rounded-xl bg-[#c5a059] text-black font-bold text-xs uppercase tracking-widest transition-all shadow-[0_4px_15px_rgba(197,160,89,0.2)] hover:bg-[#d8b068] cursor-pointer"
            >
              Generate AI Report
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12 space-y-3">
            <RefreshCw size={28} className="mx-auto text-[#c5a059] animate-spin" />
            <p className="text-xs uppercase tracking-widest font-semibold text-[#f2f2f2]">Evaluating wallet balances & cash flows...</p>
            <p className="text-[10px] text-[#555] uppercase tracking-wider">Gemini 3.6 Flash model processing ledger</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-rose-400">
              <AlertTriangle size={16} />
              <span>Insight Generation Error</span>
            </div>
            <p>{error}</p>
            <button
              onClick={fetchInsights}
              className="mt-2 px-4 py-1.5 rounded-lg bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 text-xs font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {insight && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Health Score Gauge */}
            <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-[#222] flex items-center gap-4">
              <div className="relative w-16 h-16 flex items-center justify-center rounded-full border-2 border-[#c5a059]/40 bg-[#c5a059]/10 text-[#c5a059] font-mono font-bold text-xl shrink-0">
                {insight.healthScore}
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#c5a059]">
                  <ShieldCheck size={14} />
                  <span>Wallet Health Score</span>
                </div>
                <p className="text-xs text-[#e0e0e0] mt-0.5">{insight.summary}</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0a0a0a] border border-[#222]">
                <span className="text-[10px] uppercase tracking-wider text-[#555] block">Top Expense Category</span>
                <span className="text-sm font-medium text-[#f2f2f2] block mt-0.5">
                  {insight.topSpendingCategory}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#0a0a0a] border border-[#222]">
                <span className="text-[10px] uppercase tracking-wider text-[#555] block">Savings Rate</span>
                <span className="text-sm font-mono text-[#c5a059] block mt-0.5">
                  {insight.savingsRatePercentage > 0 ? `+${insight.savingsRatePercentage}%` : `${insight.savingsRatePercentage}%`}
                </span>
              </div>
            </div>

            {/* Actionable Tips */}
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666] mb-2 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-[#c5a059]" />
                Actionable Recommendations
              </h5>
              <ul className="space-y-2">
                {insight.actionableTips.map((tip, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-[#0a0a0a] border border-[#222] text-xs text-[#888] flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[#c5a059] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Forecast */}
            <div className="p-3.5 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/30 text-xs text-[#e0e0e0]">
              <span className="font-semibold block mb-0.5 text-[#c5a059] uppercase tracking-wider text-[10px]">Monthly Cash Flow Outlook</span>
              <span>{insight.monthlyForecast}</span>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={fetchInsights}
                className="text-xs text-[#888] hover:text-[#f2f2f2] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={12} />
                Refresh AI Analysis
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#222] hover:bg-[#333] text-[#e0e0e0] text-xs uppercase tracking-widest font-semibold cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
