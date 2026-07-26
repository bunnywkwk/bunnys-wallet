# 🐰 Bunny's Wallet

> **Offline-First Personal Wallet & Financial Logger in PHP (₱)**

Bunny's Wallet is a fast, private, offline-first Progressive Web App (PWA) designed to solve daily budgeting, cash flow tracking, and multi-wallet balance management without annoying ads, cloud locks, or subscription fees.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite 6, Tailwind CSS v4
- **Icons & Visualization**: Lucide React, Recharts (Donut & Bar Charts)
- **Offline PWA Engine**: `vite-plugin-pwa`, Workbox Service Worker, Web Manifest
- **Mobile Native Bridge**: Capacitor ready (`com.bunnyswallet.app`)
- **Backend & AI**: Express / Node.js Server, Vercel Serverless API, `@google/genai` (Gemini 3.6 Flash)

---

## 🔥 Key Capabilities

- **100% Offline-First**: All financial records and balances stay securely on your device using `localStorage`.
- **Installable PWA**: Tap "Add to Home Screen" on iOS (Safari) or Android (Chrome) to run full-screen like a native mobile app with custom 3D golden bunny icons.
- **Multi-Wallet Support**: Manage Cash, GCash, Maya, BDO, BPI, or custom bank accounts with inter-wallet transfer tracking.
- **Privacy Mode**: One-tap toggle to blur sensitive balance amounts when logging in public.
- **Gemini AI Wealth Insights**: Serverless AI financial health scoring and personalized spending recommendations.
- **Data Ownership**: Export complete CSV spreadsheets or JSON backup files anytime.

---

## 📱 Brief Walkthrough by Section

### 🧮 1. Calc Tab (Calculator Input)
- **Rapid Keypad**: Tap numbers or enter math expressions (`7 + 3 = 10`).
- **Transaction Types**: Switch between `Expense`, `Income`, and `Transfer`.
- **Itemization & Categories**: Assign custom expense/income categories, wallet accounts, timestamps, and notes.
- **One-Tap Logging**: Instantly updates your account balance and ledger.

### 🏦 2. Vault Tab (Account Management)
- **Aggregate Total Cash**: View total liquidity across all active accounts.
- **Account Cards**: Track individual balances for Cash, GCash, Maya, BDO, etc.
- **Inline Starting Amount Editor**: Adjust initial balances with automatic diff recalculation.
- **Quick Tools**: +Add Custom Account/E-Wallet and Transfer Funds between wallets.

### 📊 3. Analytics Tab (Financial Insights)
- **Interactive Month Selector**: Filter charts by any month (*This Month*, *June 2026*, *All Time*).
- **KPI Summary**: Total Income, Total Expenses, and Net Savings/Deficit.
- **Cash Flow Trends**: 7-day bar chart comparing daily income vs expenses.
- **Expense Distribution**: Interactive donut chart showing expense category percentages.
- **Budget Alerts**: Progress bars warning when category spending exceeds monthly budget limits.
- **Subscriptions Tracker**: Log recurring bills (Netflix, Spotify, Utilities) with 1 tap.

### 📋 4. Logs Tab (Transaction History)
- **Full-Width Search Bar**: Search transactions by item title, category, account, or notes.
- **Filter Tabs**: Filter records by `All`, `Expense`, `Income`, or `Transfer`.
- **Drill-Down Details**: Tap any transaction to inspect timestamps, wallet source, destination, or notes.
- **Record Deletion**: Deleting a record automatically reverses its balance impact on the account.

### 🛠️ 5. Tools Tab (Settings & Utilities)
- **AI Financial Advisor**: Trigger Gemini AI analysis of your cash flow.
- **Data Backup & Restore**: Export CSV spreadsheets or backup/restore JSON data.
- **Fresh Install Controls**: Wipe data for a clean start (`Clear All Data`) or populate sample data (`Load Philippines Sample Data`).

---

## 🚀 Local Setup & Running

```bash
# Clone repository
git clone https://github.com/bunnywkwk/bunnys-wallet.git
cd bunnys-wallet

# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production & generate PWA service worker
npm run build

# Run production server
npm run start
```

---

## 📱 Phone Installation Guide

1. Open **`https://bunnys-wallet.vercel.app`** in your mobile browser.
2. **iPhone (Safari)**: Tap `Share` → `Add to Home Screen`.
3. **Android (Chrome)**: Tap `⋮` menu → `Install App` or `Add to Home Screen`.
