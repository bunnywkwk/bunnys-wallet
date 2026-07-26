import React from 'react';
import {
  Wallet,
  Eye,
  EyeOff,
  Sparkles,
  PlusCircle,
  Database,
  ArrowRightLeft,
  Smartphone,
  Monitor,
  WifiOff,
} from 'lucide-react';
import { Account, CurrencyCode } from '../types';
import { formatCurrency } from '../utils/formatters';

interface HeaderProps {
  accounts: Account[];
  currency: CurrencyCode;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  onOpenAddAccount: () => void;
  onOpenTransfer: () => void;
  onOpenAIInsights: () => void;
  onOpenExportImport: () => void;
  isMobileFrameView: boolean;
  onToggleMobileFrameView: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  accounts,
  currency,
  privacyMode,
  onTogglePrivacy,
  onOpenAddAccount,
  onOpenTransfer,
  onOpenAIInsights,
  onOpenExportImport,
  isMobileFrameView,
  onToggleMobileFrameView,
}) => {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <header className="bg-[#0a0a0a] border-b border-[#222] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.15)]">
            <Wallet size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-semibold">Personal Wallet</p>
              <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-mono">
                <WifiOff size={10} />
                Offline
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif text-[#f2f2f2] tracking-wide flex items-center gap-2">
              Bunny's Wallet
              <span className="text-[10px] font-sans uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30">
                PHP ₱
              </span>
            </h1>
          </div>
        </div>

        {/* Aggregated Total Balance Display */}
        <div className="flex items-center gap-3 bg-[#141414] px-4 py-2 rounded-2xl border border-[#222] shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#888] block font-semibold">
              Aggregate Balance
            </span>
            <span className="text-base sm:text-lg font-light text-[#c5a059] tracking-tight block font-mono">
              {privacyMode ? '••••••••' : formatCurrency(totalBalance, currency)}
            </span>
          </div>
          <button
            onClick={onTogglePrivacy}
            title={privacyMode ? 'Show Balances' : 'Hide Balances'}
            className="p-1.5 rounded-lg text-[#888] hover:text-[#f2f2f2] hover:bg-[#222] transition-colors cursor-pointer"
          >
            {privacyMode ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* AI Insights Button */}
          <button
            onClick={onOpenAIInsights}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/40 hover:bg-[#c5a059]/20 text-[#c5a059] text-xs font-medium transition-all shadow-[0_0_10px_rgba(197,160,89,0.1)] cursor-pointer"
            title="AI Financial Advisor"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span className="hidden sm:inline uppercase tracking-wider text-[11px] font-semibold">AI Advice</span>
          </button>

          {/* Quick Transfer */}
          <button
            onClick={onOpenTransfer}
            className="p-2 sm:px-3 py-2 rounded-xl bg-[#141414] border border-[#222] hover:border-[#444] text-[#888] hover:text-[#e0e0e0] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Transfer Funds Between Accounts"
          >
            <ArrowRightLeft size={15} className="text-[#c5a059]" />
            <span className="hidden md:inline text-xs uppercase tracking-wider">Transfer</span>
          </button>

          {/* Add Account */}
          <button
            onClick={onOpenAddAccount}
            className="p-2 sm:px-3 py-2 rounded-xl bg-[#141414] border border-[#222] hover:border-[#c5a059]/50 text-[#888] hover:text-[#c5a059] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Add Custom Bank or Digital Wallet"
          >
            <PlusCircle size={15} className="text-[#c5a059]" />
            <span className="hidden md:inline text-xs uppercase tracking-wider">+ Account</span>
          </button>

          {/* Backup/Export */}
          <button
            onClick={onOpenExportImport}
            className="p-2 rounded-xl bg-[#141414] border border-[#222] hover:border-[#444] text-[#888] hover:text-[#e0e0e0] text-xs transition-colors cursor-pointer"
            title="Backup & Export Data"
          >
            <Database size={15} />
          </button>

          {/* View Mode Toggle: Mobile Frame vs Wide Dashboard */}
          <button
            onClick={onToggleMobileFrameView}
            className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
              isMobileFrameView
                ? 'bg-[#c5a059]/20 border-[#c5a059] text-[#c5a059]'
                : 'bg-[#141414] border-[#222] text-[#888] hover:text-[#e0e0e0]'
            }`}
            title={isMobileFrameView ? 'Switch to Full Dashboard' : 'Switch to Mobile Frame'}
          >
            {isMobileFrameView ? <Smartphone size={15} /> : <Monitor size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
};
