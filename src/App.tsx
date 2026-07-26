import React, { useEffect, useState } from 'react';
import {
  Wallet,
  Calculator as CalcIcon,
  BarChart3,
  ListFilter,
  Sparkles,
  Smartphone,
  Plus,
  Menu,
  ArrowRightLeft,
  PlusCircle,
  Tag,
  Database,
  WifiOff,
  Eye,
  EyeOff,
  Monitor,
  RotateCcw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { Account, Category, CurrencyCode, RecurringSubscription, Transaction } from './types';
import { WalletStorageManager } from './storage/walletStorage';
import { Header } from './components/Header';
import { TheVault } from './components/TheVault';
import { CalculatorInput } from './components/CalculatorInput';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { TransactionHistory } from './components/TransactionHistory';
import { AddAccountModal } from './components/AddAccountModal';
import { AddCategoryModal } from './components/AddCategoryModal';
import { AccountTransferModal } from './components/AccountTransferModal';
import { AIInsightsModal } from './components/AIInsightsModal';
import { ExportImportModal } from './components/ExportImportModal';
import { formatCurrency } from './utils/formatters';

export default function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurring, setRecurring] = useState<RecurringSubscription[]>([]);
  const [currency] = useState<CurrencyCode>('PHP');
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);

  // Smart screen auto-detection
  const [isRealMobile, setIsRealMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  const [isMobileFrameView, setIsMobileFrameView] = useState<boolean>(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'vault' | 'calc' | 'analytics' | 'history' | 'tools'>('calc');

  // Modal controls
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isAIInsightsOpen, setIsAIInsightsOpen] = useState(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);

  // Filter state
  const [selectedAccountIdFilter, setSelectedAccountIdFilter] = useState<string | null>(null);
  const [selectedCategoryIdFilter, setSelectedCategoryIdFilter] = useState<string | null>(null);

  // Screen resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsRealMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync state from storage
  const syncStorage = () => {
    setAccounts(WalletStorageManager.getAccounts());
    setCategories(WalletStorageManager.getCategories());
    setTransactions(WalletStorageManager.getTransactions());
    setRecurring(WalletStorageManager.getRecurring());
    setPrivacyMode(WalletStorageManager.getPrivacyMode());
  };

  useEffect(() => {
    syncStorage();

    const handleUpdate = () => syncStorage();
    window.addEventListener('vault_data_updated', handleUpdate);
    return () => window.removeEventListener('vault_data_updated', handleUpdate);
  }, []);

  const handleTogglePrivacy = () => {
    WalletStorageManager.setPrivacyMode(!privacyMode);
  };

  const handleClearFilters = () => {
    setSelectedAccountIdFilter(null);
    setSelectedCategoryIdFilter(null);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Active view decision:
  // If running on a REAL smartphone screen (<768px), ALWAYS show native full-screen mobile view.
  // On desktop screens (>=768px), show desktop layout unless user toggled isMobileFrameView.
  const isMobileActive = isRealMobile || isMobileFrameView;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-sans selection:bg-[#c5a059]/30 selection:text-[#c5a059]">
      {/* App Header (rendered on Desktop View) */}
      {!isMobileActive && (
        <Header
          accounts={accounts}
          currency={currency}
          privacyMode={privacyMode}
          onTogglePrivacy={handleTogglePrivacy}
          onOpenAddAccount={() => setIsAddAccountOpen(true)}
          onOpenTransfer={() => setIsTransferOpen(true)}
          onOpenAIInsights={() => setIsAIInsightsOpen(true)}
          onOpenExportImport={() => setIsExportImportOpen(true)}
          isMobileFrameView={isMobileFrameView}
          onToggleMobileFrameView={() => setIsMobileFrameView(!isMobileFrameView)}
        />
      )}

      {/* Main Container */}
      <main className={isMobileActive ? 'w-full min-h-screen bg-[#0a0a0a] pb-36' : 'py-6 px-2 sm:px-6 max-w-7xl mx-auto'}>
        {isMobileActive ? (
          /* Mobile View Container */
          <div
            className={
              isRealMobile
                ? 'w-full min-h-screen bg-[#0a0a0a] px-3 pt-2 pb-36 space-y-4'
                : 'max-w-md mx-auto my-2 rounded-[36px] border-[8px] border-[#1f1f1f] bg-[#141414] p-4 shadow-2xl space-y-4 relative pb-28'
            }
          >
            {/* Phone Speaker Notch (Desktop Simulator Only) */}
            {!isRealMobile && (
              <div className="w-28 h-4 mx-auto rounded-full bg-[#0a0a0a] flex items-center justify-center mb-2">
                <div className="w-10 h-1 rounded-full bg-[#222]" />
              </div>
            )}

            {/* Integrated Mobile App Header Bar */}
            <div className="bg-[#141414] border border-[#222] rounded-2xl p-3 flex items-center justify-between gap-2 shadow-md sticky top-2 z-40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0a0a0a] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059]">
                  <Wallet size={16} />
                </div>
                <div>
                  <h1 className="text-sm font-serif text-[#f2f2f2] font-semibold flex items-center gap-1.5">
                    Bunny's Wallet
                    <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 font-sans">
                      PHP ₱
                    </span>
                  </h1>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 flex items-center gap-1 font-mono">
                    <WifiOff size={9} />
                    100% Offline
                  </span>
                </div>
              </div>

              {/* Mobile Total Balance & Privacy Toggle */}
              <div className="flex items-center gap-2 bg-[#0a0a0a] px-2.5 py-1 rounded-xl border border-[#222]">
                <div className="text-right">
                  <span className="text-[8px] uppercase tracking-wider text-[#666] block">Total</span>
                  <span className="text-xs font-mono font-medium text-[#c5a059]">
                    {privacyMode ? '•••••' : formatCurrency(totalBalance, currency)}
                  </span>
                </div>
                <button
                  onClick={handleTogglePrivacy}
                  className="p-1 text-[#888] hover:text-[#f2f2f2] cursor-pointer"
                  title="Toggle Privacy"
                >
                  {privacyMode ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {!isRealMobile && (
                <button
                  onClick={() => setIsMobileFrameView(false)}
                  className="p-1.5 rounded-lg bg-[#0a0a0a] border border-[#222] text-[#888] hover:text-[#f2f2f2] cursor-pointer"
                  title="Switch to Desktop View"
                >
                  <Monitor size={14} />
                </button>
              )}
            </div>

            {/* Tab Body */}
            <div className="min-h-[500px] space-y-4">
              {activeMobileTab === 'vault' && (
                <TheVault
                  accounts={accounts}
                  currency={currency}
                  privacyMode={privacyMode}
                  onOpenAddAccount={() => setIsAddAccountOpen(true)}
                  onOpenTransfer={() => setIsTransferOpen(true)}
                  onSelectAccountFilter={(id) => {
                    setSelectedAccountIdFilter(id);
                    setActiveMobileTab('history');
                  }}
                  selectedAccountId={selectedAccountIdFilter}
                />
              )}

              {activeMobileTab === 'calc' && (
                <CalculatorInput
                  accounts={accounts}
                  categories={categories}
                  currency={currency}
                  onOpenAddCategory={() => setIsAddCategoryOpen(true)}
                  onTransactionAdded={() => syncStorage()}
                />
              )}

              {activeMobileTab === 'analytics' && (
                <AnalyticsDashboard
                  transactions={transactions}
                  categories={categories}
                  recurring={recurring}
                  currency={currency}
                  privacyMode={privacyMode}
                  onSelectCategoryFilter={(catId) => {
                    setSelectedCategoryIdFilter(catId);
                    setActiveMobileTab('history');
                  }}
                />
              )}

              {activeMobileTab === 'history' && (
                <TransactionHistory
                  transactions={transactions}
                  categories={categories}
                  accounts={accounts}
                  currency={currency}
                  privacyMode={privacyMode}
                  selectedAccountIdFilter={selectedAccountIdFilter}
                  selectedCategoryIdFilter={selectedCategoryIdFilter}
                  onClearFilters={handleClearFilters}
                />
              )}

              {activeMobileTab === 'tools' && (
                /* Mobile Tools & Settings Page */
                <div className="bg-[#111] border border-[#222] rounded-3xl p-4 sm:p-5 space-y-5 shadow-2xl animate-in fade-in duration-200">
                  <div className="border-b border-[#222] pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-serif text-[#f2f2f2] uppercase tracking-wider font-semibold">
                        Tools & Wallet Actions
                      </h2>
                      <p className="text-[10px] uppercase tracking-widest text-[#555]">
                        All actions & offline settings
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-[#141414] text-[#c5a059] border border-[#c5a059]/30">
                      <Menu size={16} />
                    </div>
                  </div>

                  {/* Primary Tools Grid */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {/* AI Advice Button */}
                    <button
                      onClick={() => setIsAIInsightsOpen(true)}
                      className="p-3.5 rounded-2xl bg-[#141414] border border-[#c5a059]/30 hover:border-[#c5a059] text-left flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30">
                          <Sparkles size={18} className="animate-pulse" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#f2f2f2] block">
                            AI Wealth Insights
                          </span>
                          <span className="text-[10px] text-[#888] block">
                            Gemini cash flow analysis & score
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] px-2.5 py-1 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30">
                        Open
                      </span>
                    </button>

                    {/* Account Transfer Button */}
                    <button
                      onClick={() => setIsTransferOpen(true)}
                      className="p-3.5 rounded-2xl bg-[#141414] border border-[#222] hover:border-[#c5a059]/50 text-left flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[#0a0a0a] text-[#c5a059] border border-[#222]">
                          <ArrowRightLeft size={18} />
                        </div>
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#f2f2f2] block">
                            Transfer Between Wallets
                          </span>
                          <span className="text-[10px] text-[#888] block">
                            Move PHP funds between cash & bank
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-[#888] group-hover:text-[#c5a059]">
                        Transfer →
                      </span>
                    </button>

                    {/* Add Account Button */}
                    <button
                      onClick={() => setIsAddAccountOpen(true)}
                      className="p-3.5 rounded-2xl bg-[#141414] border border-[#222] hover:border-[#c5a059]/50 text-left flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[#0a0a0a] text-[#c5a059] border border-[#222]">
                          <PlusCircle size={18} />
                        </div>
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#f2f2f2] block">
                            Add New Account / E-Wallet
                          </span>
                          <span className="text-[10px] text-[#888] block">
                            GCash, Maya, BDO, Cash, BPI
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-[#888] group-hover:text-[#c5a059]">
                        + Add
                      </span>
                    </button>

                    {/* Add Custom Category Button */}
                    <button
                      onClick={() => setIsAddCategoryOpen(true)}
                      className="p-3.5 rounded-2xl bg-[#141414] border border-[#222] hover:border-[#c5a059]/50 text-left flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[#0a0a0a] text-[#c5a059] border border-[#222]">
                          <Tag size={18} />
                        </div>
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#f2f2f2] block">
                            Add Custom Category
                          </span>
                          <span className="text-[10px] text-[#888] block">
                            Define new expense or income tags
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-[#888] group-hover:text-[#c5a059]">
                        + Create
                      </span>
                    </button>

                    {/* Backup & CSV Export Button */}
                    <button
                      onClick={() => setIsExportImportOpen(true)}
                      className="p-3.5 rounded-2xl bg-[#141414] border border-[#222] hover:border-[#c5a059]/50 text-left flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[#0a0a0a] text-[#c5a059] border border-[#222]">
                          <Database size={18} />
                        </div>
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#f2f2f2] block">
                            Data Backup & Export
                          </span>
                          <span className="text-[10px] text-[#888] block">
                            Download CSV sheets or restore JSON
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-[#888] group-hover:text-[#c5a059]">
                        Export
                      </span>
                    </button>
                  </div>

                  {/* Storage Management & Data Control */}
                  <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-[#222] space-y-3">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#888]">
                      <span className="flex items-center gap-1 text-emerald-400 font-mono font-bold">
                        <WifiOff size={11} />
                        Offline Engine Active
                      </span>
                      <span className="font-mono text-[#555]">localStorage</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-[#222]">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#555] block">Wallets</span>
                        <span className="text-sm font-mono font-bold text-[#f2f2f2]">{accounts.length}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#555] block">Categories</span>
                        <span className="text-sm font-mono font-bold text-[#f2f2f2]">{categories.length}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#555] block">Logs</span>
                        <span className="text-sm font-mono font-bold text-[#f2f2f2]">{transactions.length}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        onClick={() => {
                          if (confirm('Clear all transactions and reset balances for a clean fresh install?')) {
                            WalletStorageManager.clearAllData();
                            syncStorage();
                          }
                        }}
                        className="w-full py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-[10px] uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 size={12} />
                        Clear All Data (Fresh Start)
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Load preset Philippine sample wallet data for testing?')) {
                            WalletStorageManager.resetToPreset();
                            syncStorage();
                          }
                        }}
                        className="w-full py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 text-[10px] uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles size={12} />
                        Load Philippines Sample Data
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fixed Mobile Bottom Navigation Bar */}
            <div
              className={
                isRealMobile
                  ? 'fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-[#222] p-2 flex items-center justify-around z-50 shadow-2xl pb-safe'
                  : 'absolute bottom-3 left-3 right-3 bg-[#0a0a0a]/95 backdrop-blur-md border border-[#222] rounded-2xl p-1.5 flex items-center justify-around z-30 shadow-2xl'
              }
            >
              <button
                onClick={() => setActiveMobileTab('calc')}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
                  activeMobileTab === 'calc'
                    ? 'text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30'
                    : 'text-[#666] hover:text-[#888]'
                }`}
              >
                <CalcIcon size={16} />
                <span className="uppercase tracking-widest text-[9px]">Calc</span>
              </button>

              <button
                onClick={() => setActiveMobileTab('vault')}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
                  activeMobileTab === 'vault'
                    ? 'text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30'
                    : 'text-[#666] hover:text-[#888]'
                }`}
              >
                <Wallet size={16} />
                <span className="uppercase tracking-widest text-[9px]">Vault</span>
              </button>

              <button
                onClick={() => setActiveMobileTab('analytics')}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
                  activeMobileTab === 'analytics'
                    ? 'text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30'
                    : 'text-[#666] hover:text-[#888]'
                }`}
              >
                <BarChart3 size={16} />
                <span className="uppercase tracking-widest text-[9px]">Analytics</span>
              </button>

              <button
                onClick={() => setActiveMobileTab('history')}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
                  activeMobileTab === 'history'
                    ? 'text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30'
                    : 'text-[#666] hover:text-[#888]'
                }`}
              >
                <ListFilter size={16} />
                <span className="uppercase tracking-widest text-[9px]">Logs</span>
              </button>

              <button
                onClick={() => setActiveMobileTab('tools')}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
                  activeMobileTab === 'tools'
                    ? 'text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30'
                    : 'text-[#666] hover:text-[#888]'
                }`}
              >
                <Menu size={16} />
                <span className="uppercase tracking-widest text-[9px]">Tools</span>
              </button>
            </div>
          </div>
        ) : (
          /* Desktop Dashboard Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (5 Cols): Calculator Input & The Vault */}
            <div className="lg:col-span-5 space-y-6">
              <CalculatorInput
                accounts={accounts}
                categories={categories}
                currency={currency}
                onOpenAddCategory={() => setIsAddCategoryOpen(true)}
                onTransactionAdded={() => syncStorage()}
              />

              <TheVault
                accounts={accounts}
                currency={currency}
                privacyMode={privacyMode}
                onOpenAddAccount={() => setIsAddAccountOpen(true)}
                onOpenTransfer={() => setIsTransferOpen(true)}
                onSelectAccountFilter={(id) => setSelectedAccountIdFilter(id)}
                selectedAccountId={selectedAccountIdFilter}
              />
            </div>

            {/* Right Column (7 Cols): Analytics Dashboard & Transaction History */}
            <div className="lg:col-span-7 space-y-6">
              <AnalyticsDashboard
                transactions={transactions}
                categories={categories}
                recurring={recurring}
                currency={currency}
                privacyMode={privacyMode}
                onSelectCategoryFilter={(catId) => setSelectedCategoryIdFilter(catId)}
              />

              <TransactionHistory
                transactions={transactions}
                categories={categories}
                accounts={accounts}
                currency={currency}
                privacyMode={privacyMode}
                selectedAccountIdFilter={selectedAccountIdFilter}
                selectedCategoryIdFilter={selectedCategoryIdFilter}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        currency={currency}
      />

      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
      />

      <AccountTransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        accounts={accounts}
        currency={currency}
      />

      <AIInsightsModal
        isOpen={isAIInsightsOpen}
        onClose={() => setIsAIInsightsOpen(false)}
        transactions={transactions}
        accounts={accounts}
        categories={categories}
        currency={currency}
      />

      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
      />
    </div>
  );
}
