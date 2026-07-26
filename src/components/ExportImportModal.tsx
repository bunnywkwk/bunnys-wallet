import React, { useRef, useState } from 'react';
import { X, Download, Upload, RefreshCw, FileText } from 'lucide-react';
import { WalletStorageManager } from '../storage/walletStorage';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({ isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const data = {
      accounts: WalletStorageManager.getAccounts(),
      transactions: WalletStorageManager.getTransactions(),
      categories: WalletStorageManager.getCategories(),
      recurring: WalletStorageManager.getRecurring(),
      exportDate: new Date().toISOString(),
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `vault_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const transactions = WalletStorageManager.getTransactions();
    const categories = WalletStorageManager.getCategories();
    const accounts = WalletStorageManager.getAccounts();

    let csvContent = 'Date,Time,Type,Title/Item,Category,Account,Amount,Note\n';

    transactions.forEach((t) => {
      const dateObj = new Date(t.timestamp);
      const dateStr = dateObj.toLocaleDateString('en-US');
      const timeStr = dateObj.toLocaleTimeString('en-US');
      const categoryName = categories.find((c) => c.id === t.categoryId)?.name || 'General';
      const accountName = accounts.find((a) => a.id === t.accountId)?.name || 'Account';
      const cleanTitle = (t.name || '').replace(/"/g, '""');
      const cleanNote = (t.note || '').replace(/"/g, '""');

      csvContent += `"${dateStr}","${timeStr}","${t.type}","${cleanTitle}","${categoryName}","${accountName}",${t.amount},"${cleanNote}"\n`;
    });

    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vault_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.accounts && parsed.transactions && parsed.categories) {
          WalletStorageManager.saveAccounts(parsed.accounts);
          WalletStorageManager.saveTransactions(parsed.transactions);
          WalletStorageManager.saveCategories(parsed.categories);
          if (parsed.recurring) WalletStorageManager.saveRecurring(parsed.recurring);
          setImportStatus('Data successfully restored from backup file!');
        } else {
          setImportStatus('Error: Invalid backup file structure.');
        }
      } catch (err) {
        setImportStatus('Error parsing backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#141414] border border-[#222] rounded-3xl w-full max-w-md p-6 text-[#e0e0e0] shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#222]">
          <h3 className="text-lg font-serif text-[#f2f2f2] uppercase tracking-wider">Data Backup & Export</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#888] hover:text-[#f2f2f2] hover:bg-[#222] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-2 font-semibold">
              Export Wallet Data
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0a0a0a] border border-[#222] hover:border-[#c5a059]/50 text-[#888] hover:text-[#c5a059] text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
              >
                <FileText size={15} />
                Export CSV
              </button>
              <button
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0a0a0a] border border-[#222] hover:border-[#c5a059]/50 text-[#888] hover:text-[#c5a059] text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
              >
                <Download size={15} />
                Backup JSON
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-2 font-semibold">
              Restore from Backup
            </label>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleImportFile}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0a0a0a] border border-dashed border-[#333] hover:border-[#555] text-[#888] hover:text-[#f2f2f2] text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
            >
              <Upload size={15} />
              Select Backup JSON
            </button>
            {importStatus && (
              <p className="mt-2 text-xs text-center font-mono text-[#c5a059]">{importStatus}</p>
            )}
          </div>

          <div className="pt-2 border-t border-[#222]">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to load fresh preset Philippine wallet data?')) {
                  WalletStorageManager.resetToPreset();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              Reset & Load Philippines Sample
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
