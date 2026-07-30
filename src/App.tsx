import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  ArrowRightLeft, 
  PiggyBank, 
  CreditCard, 
  Link2, 
  User, 
  RefreshCw, 
  SlidersHorizontal,
  Wifi,
  Battery,
  Signal,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info,
  Bell
} from 'lucide-react';

import { BankAccount, Transaction, Budget, AppNotification } from './types';
import { INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS, INITIAL_BUDGETS, INITIAL_CONTACTS } from './data/mockData';

import AppleCard from './components/AppleCard';
import BankConnectionModal from './components/BankConnectionModal';
import PaymentModal from './components/PaymentModal';
import BudgetManager from './components/BudgetManager';
import TransactionList from './components/TransactionList';

// Supported Dynamic Currencies
const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
];

// Curated Luxury Themes
const THEMES = [
  {
    id: 'obsidian-gold',
    name: 'Obsidian Gold',
    primary: '#E8D4A2',
    primaryDark: '#C5A059',
    bgDeep: '#0C0C0D',
    bgCard: '#1C1C1E',
    bgBorder: '#2C2C2E',
    textMuted: '#8E8E93',
    textSecondary: '#A1A1A5',
    textLight: '#D2D2D7',
    textMain: '#F5F5F5',
    bodyBg: '#050505',
    dotColor: '#E8D4A2'
  },
  {
    id: 'titanium-silver',
    name: 'Titanium Silver',
    primary: '#E5E5EA',
    primaryDark: '#8E8E93',
    bgDeep: '#090A0C',
    bgCard: '#16181C',
    bgBorder: '#2C2F36',
    textMuted: '#7D8087',
    textSecondary: '#B0B3B8',
    textLight: '#D2D2D7',
    textMain: '#FFFFFF',
    bodyBg: '#030304',
    dotColor: '#E5E5EA'
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    primary: '#60A5FA',
    primaryDark: '#2563EB',
    bgDeep: '#070A12',
    bgCard: '#111827',
    bgBorder: '#1F2937',
    textMuted: '#6B7280',
    textSecondary: '#9CA3AF',
    textLight: '#D1D5DB',
    textMain: '#F3F4F6',
    bodyBg: '#03050A',
    dotColor: '#60A5FA'
  },
  {
    id: 'emerald-velvet',
    name: 'Emerald Velvet',
    primary: '#A7F3D0',
    primaryDark: '#059669',
    bgDeep: '#040D0A',
    bgCard: '#0C2018',
    bgBorder: '#183A2C',
    textMuted: '#6EE7B7',
    textSecondary: '#A7F3D0',
    textLight: '#ECFDF5',
    textMain: '#ECFDF5',
    bodyBg: '#020604',
    dotColor: '#34D399'
  },
  {
    id: 'sunset-copper',
    name: 'Sunset Copper',
    primary: '#FDBA74',
    primaryDark: '#EA580C',
    bgDeep: '#0C0908',
    bgCard: '#201512',
    bgBorder: '#36241E',
    textMuted: '#F97316',
    textSecondary: '#FDBA74',
    textLight: '#FFF7ED',
    textMain: '#FFF7ED',
    bodyBg: '#050403',
    dotColor: '#FB923C'
  },
  {
    id: 'alabaster-pearl',
    name: 'Alabaster Pearl',
    primary: '#0071E3',
    primaryDark: '#0051A2',
    bgDeep: '#F5F5F7',
    bgCard: '#FFFFFF',
    bgBorder: '#E5E5EA',
    textMuted: '#8E8E93',
    textSecondary: '#636366',
    textLight: '#3A3A3C',
    textMain: '#1C1C1E',
    bodyBg: '#E5E5EA',
    dotColor: '#0071E3'
  },
  {
    id: 'champagne-cream',
    name: 'Champagne Cream',
    primary: '#B38E22',
    primaryDark: '#7D5F0D',
    bgDeep: '#FAF8F5',
    bgCard: '#FFFFFF',
    bgBorder: '#EBE4DB',
    textMuted: '#A49C90',
    textSecondary: '#6E675F',
    textLight: '#453E38',
    textMain: '#2E251E',
    bodyBg: '#FAF8F5',
    dotColor: '#B38E22'
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    primary: '#D44A6A',
    primaryDark: '#9C2F46',
    bgDeep: '#FCF6F7',
    bgCard: '#FFFFFF',
    bgBorder: '#F2E1E3',
    textMuted: '#BAA4A7',
    textSecondary: '#8A6F73',
    textLight: '#5C4447',
    textMain: '#3D272A',
    bodyBg: '#FCF6F7',
    dotColor: '#D44A6A'
  },
  {
    id: 'mint-breeze',
    name: 'Mint Breeze',
    primary: '#10B981',
    primaryDark: '#047857',
    bgDeep: '#F0FDF4',
    bgCard: '#FFFFFF',
    bgBorder: '#DCFCE7',
    textMuted: '#A7F3D0',
    textSecondary: '#065F46',
    textLight: '#064E3B',
    textMain: '#022C22',
    bodyBg: '#F0FDF4',
    dotColor: '#10B981'
  }
];

export default function App() {
  // State Initialization from LocalStorage
  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem('apple_bank_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('apple_bank_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('apple_bank_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  // Fetch full-stack database entries on mount
  useEffect(() => {
    const syncWithBackend = async () => {
      try {
        const accRes = await fetch('/api/accounts');
        if (accRes.ok) {
          const accData = await accRes.json();
          setAccounts(accData);
        }
        const txRes = await fetch('/api/transactions');
        if (txRes.ok) {
          const txData = await txRes.json();
          setTransactions(txData);
        }
        const bRes = await fetch('/api/budgets');
        if (bRes.ok) {
          const bData = await bRes.json();
          setBudgets(bData);
        }
      } catch (err) {
        console.error('Error synchronizing with Express backend:', err);
      }
    };
    syncWithBackend();
  }, []);

  // User Profile & Settings State
  const [themeDesign, setThemeDesign] = useState<string>(() => {
    return localStorage.getItem('apple_wallet_theme') || 'obsidian-gold';
  });

  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('apple_wallet_currency') || 'USD';
  });

  const [profileName, setProfileName] = useState<string>(() => {
    return localStorage.getItem('apple_wallet_profile_name') || 'Julian';
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Synchronize dynamic settings
  useEffect(() => {
    localStorage.setItem('apple_wallet_theme', themeDesign);
  }, [themeDesign]);

  useEffect(() => {
    localStorage.setItem('apple_wallet_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('apple_wallet_profile_name', profileName);
  }, [profileName]);

  const [activeAccountId, setActiveAccountId] = useState<string>(() => {
    return accounts[0]?.id || 'acc-apple-card';
  });

  const activeCurrencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const currencySymbol = activeCurrencyObj.symbol;

  const activeThemeObj = THEMES.find(t => t.id === themeDesign) || THEMES[0];

  const activeBgStyle = activeThemeObj.bodyBg;

  // Inject background style dynamically onto body/viewport background
  useEffect(() => {
    document.body.style.background = activeBgStyle;
    document.body.style.transition = 'background 0.7s ease-in-out';
  }, [activeBgStyle]);

  // Inject luxury theme custom variables dynamically onto root document
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-color-primary', activeThemeObj.primary);
    root.style.setProperty('--theme-color-primary-dark', activeThemeObj.primaryDark);
    root.style.setProperty('--theme-color-bg-deep', activeThemeObj.bgDeep);
    root.style.setProperty('--theme-color-bg-card', activeThemeObj.bgCard);
    root.style.setProperty('--theme-color-bg-border', activeThemeObj.bgBorder);
    root.style.setProperty('--theme-color-text-muted', activeThemeObj.textMuted);
    root.style.setProperty('--theme-color-text-secondary', activeThemeObj.textSecondary);
    root.style.setProperty('--theme-color-text-light', activeThemeObj.textLight);
    root.style.setProperty('--theme-color-text-main', activeThemeObj.textMain);
    root.style.setProperty('--theme-color-body-bg', activeThemeObj.bodyBg);
  }, [themeDesign, activeThemeObj]);

  const [activeTab, setActiveTab] = useState<'wallet' | 'budget' | 'payments'>('wallet');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Synchronize Live Clock for iOS Header Mock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Save to LocalStorage and dynamically recalculate budget spending based on transactions
  useEffect(() => {
    // Dynamically calculate budget spending by summing completed expenses belonging to those budget categories
    setBudgets(prev => {
      const updatedBudgets = prev.map(b => {
        const spentForCategory = transactions
          .filter(t => t.category === b.category && t.amount < 0)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        return {
          ...b,
          spent: parseFloat(spentForCategory.toFixed(2))
        };
      });
      localStorage.setItem('apple_bank_budgets', JSON.stringify(updatedBudgets));
      return updatedBudgets;
    });

    localStorage.setItem('apple_bank_accounts', JSON.stringify(accounts));
    localStorage.setItem('apple_bank_transactions', JSON.stringify(transactions));
  }, [accounts, transactions]);

  // Notifications State and Hub
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('apple_bank_notifications');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'init-notif-1',
        type: 'success',
        category: 'Food & Dining',
        title: 'Budget Healthy (GREEN)',
        message: 'Food & Dining budget is safe at $90.95 of $400.00 limit.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: false
      },
      {
        id: 'init-notif-2',
        type: 'success',
        category: 'Shopping',
        title: 'Budget Healthy (GREEN)',
        message: 'Shopping budget is safe at $203.50 of $300.00 limit.',
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
        isRead: false
      }
    ];
  });

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Track over budget categories to detect transition from MET to OVER, or OVER to MET
  const [prevOverBudget, setPrevOverBudget] = useState<string[]>(() => {
    const savedBudgetsString = localStorage.getItem('apple_bank_budgets');
    if (savedBudgetsString) {
      try {
        const savedBudgets = JSON.parse(savedBudgetsString) as Budget[];
        return savedBudgets.filter(b => b.spent > b.limit).map(b => b.category);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Sync notifications whenever budgets change state
  useEffect(() => {
    const currentOverBudget = budgets
      .filter(b => b.spent > b.limit)
      .map(b => b.category);

    // Categories that transitioned from safe -> over limit
    const newlyOver = currentOverBudget.filter(cat => !prevOverBudget.includes(cat));
    // Categories that transitioned from over limit -> safe
    const newlyUnder = prevOverBudget.filter(cat => !currentOverBudget.includes(cat));

    const newNotifications: AppNotification[] = [];

    newlyOver.forEach(cat => {
      const b = budgets.find(x => x.category === cat);
      if (b) {
        newNotifications.push({
          id: `notif-over-${cat}-${Date.now()}`,
          type: 'danger',
          category: cat,
          title: 'Budget Exceeded (RED)',
          message: `Spending on "${cat}" is $${b.spent.toFixed(2)}, exceeding your $${b.limit.toFixed(2)} limit by $${(b.spent - b.limit).toFixed(2)}!`,
          timestamp: new Date().toISOString(),
          isRead: false
        });
      }
    });

    newlyUnder.forEach(cat => {
      const b = budgets.find(x => x.category === cat);
      if (b) {
        newNotifications.push({
          id: `notif-under-${cat}-${Date.now()}`,
          type: 'success',
          category: cat,
          title: 'Budget Met (GREEN)',
          message: `Spending on "${cat}" is back within target limits at $${b.spent.toFixed(2)} (Limit: $${b.limit.toFixed(2)}).`,
          timestamp: new Date().toISOString(),
          isRead: false
        });
      }
    });

    if (newNotifications.length > 0) {
      setNotifications(prev => {
        const updated = [...newNotifications, ...prev];
        localStorage.setItem('apple_bank_notifications', JSON.stringify(updated));
        return updated;
      });
    }

    setPrevOverBudget(currentOverBudget);
  }, [budgets, prevOverBudget]);

  const handleClearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('apple_bank_notifications');
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(prev => {
      const next = !prev;
      if (next) {
        setNotifications(curr => {
          const updated = curr.map(n => ({ ...n, isRead: true }));
          localStorage.setItem('apple_bank_notifications', JSON.stringify(updated));
          return updated;
        });
      }
      return next;
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Budget validation alerts
  const globalBudgetLimit = budgets.reduce((acc, curr) => acc + curr.limit, 0);
  const globalBudgetSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
  const isGlobalOverBudget = globalBudgetSpent > globalBudgetLimit;

  // Connected banks status
  const connectedBanksCount = accounts.filter(acc => acc.isConnected).length;

  // Welcome dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    let prefix = 'Good evening';
    if (hour < 12) prefix = 'Good morning';
    else if (hour < 17) prefix = 'Good afternoon';
    return `${prefix}, ${profileName}`;
  };

  // Actions
  const handleConnectBank = async (newAccount: BankAccount) => {
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount)
      });
      if (res.ok) {
        const savedAccount = await res.json();
        setAccounts(prev => [...prev, savedAccount]);
        setActiveAccountId(savedAccount.id);
      }
    } catch (err) {
      console.error('Error connecting account on server:', err);
      setAccounts(prev => [...prev, newAccount]);
      setActiveAccountId(newAccount.id);
    }
  };

  const handleSyncAccount = async (id: string) => {
    try {
      const res = await fetch(`/api/accounts/${id}/sync`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const { account, newTransaction } = data;
        
        // Update account balance
        setAccounts(prev => prev.map(a => a.id === id ? account : a));
        // Add new transaction to list
        setTransactions(prev => [newTransaction, ...prev]);

        // Add a push notification
        const currencySym = CURRENCIES.find(c => c.code === currency)?.symbol || '$';
        const isExpense = newTransaction.amount < 0;
        const formattedAmount = `${currencySym}${Math.abs(newTransaction.amount).toFixed(2)}`;
        
        const notif: AppNotification = {
          id: `notif-sync-${Date.now()}`,
          type: 'success',
          category: newTransaction.category,
          title: `Feeds Updated: ${newTransaction.description}`,
          message: isExpense 
            ? `New transaction of ${formattedAmount} synchronized on your ${account.bankName} account.`
            : `New deposit of ${formattedAmount} synchronized on your ${account.bankName} account.`,
          timestamp: new Date().toISOString(),
          isRead: false
        };
        
        setNotifications(prev => {
          const updated = [notif, ...prev];
          localStorage.setItem('apple_bank_notifications', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error('Error syncing bank account:', err);
    }
  };

  const handleExecutePayment = async (paymentData: {
    amount: number;
    description: string;
    category: string;
    accountId: string;
    contactName?: string;
  }) => {
    const newTx: Transaction = {
      id: `tx-user-${Date.now()}`,
      date: new Date().toISOString(),
      description: paymentData.description,
      amount: -paymentData.amount, // Payments are outgoing
      category: paymentData.category,
      accountId: paymentData.accountId,
      status: 'completed'
    };

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTx)
      });
      if (res.ok) {
        const { transaction, account } = await res.json();
        setTransactions(prev => [transaction, ...prev]);
        if (account) {
          setAccounts(prev => prev.map(acc => acc.id === account.id ? account : acc));
        }
      }
    } catch (err) {
      console.error('Error executing payment on server:', err);
      // Fallback
      setAccounts(prev => prev.map(acc => {
        if (acc.id === paymentData.accountId) {
          return {
            ...acc,
            balance: parseFloat((acc.balance - paymentData.amount).toFixed(2))
          };
        }
        return acc;
      }));
      setTransactions(prev => [newTx, ...prev]);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const { account } = await res.json();
        setTransactions(prev => prev.filter(t => t.id !== id));
        if (account) {
          setAccounts(prev => prev.map(acc => acc.id === account.id ? account : acc));
        }
      }
    } catch (err) {
      console.error('Error deleting transaction on server:', err);
      const txToDelete = transactions.find(t => t.id === id);
      if (!txToDelete) return;
      setAccounts(prev => prev.map(acc => {
        if (acc.id === txToDelete.accountId) {
          return {
            ...acc,
            balance: parseFloat((acc.balance - txToDelete.amount).toFixed(2))
          };
        }
        return acc;
      }));
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleUpdateBudgetLimit = async (id: string, newLimit: number) => {
    const budget = budgets.find(b => b.id === id);
    if (!budget) return;
    const updatedBudget = { ...budget, limit: newLimit };
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBudget)
      });
      if (res.ok) {
        const allBudgets = await res.json();
        setBudgets(allBudgets);
      }
    } catch (err) {
      console.error('Error updating budget limit:', err);
      setBudgets(prev => prev.map(b => b.id === id ? { ...b, limit: newLimit } : b));
    }
  };

  const handleAddBudget = async (category: string, limit: number, iconName: string) => {
    const newB: Budget = {
      id: `b-custom-${Date.now()}`,
      category,
      limit,
      spent: 0,
      iconName
    };
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newB)
      });
      if (res.ok) {
        const allBudgets = await res.json();
        setBudgets(allBudgets);
      }
    } catch (err) {
      console.error('Error creating budget:', err);
      setBudgets(prev => [...prev, newB]);
    }
  };

  const handleResetSandbox = async () => {
    if (confirm('Are you sure you want to restore default sandbox financial data? This will clear customized connected accounts, budgets, transaction history, profile, currency, and active theme settings.')) {
      localStorage.clear();
      try {
        const res = await fetch('/api/reset', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setAccounts(data.accounts);
          setTransactions(data.transactions);
          setBudgets(data.budgets);
        }
      } catch (err) {
        console.error('Error resetting sandbox database:', err);
        setAccounts(INITIAL_ACCOUNTS);
        setTransactions(INITIAL_TRANSACTIONS);
        setBudgets(INITIAL_BUDGETS);
      }
      setThemeDesign('obsidian-gold');
      setCurrency('USD');
      setProfileName('Julian');
      setActiveAccountId(INITIAL_ACCOUNTS[0].id);
      setActiveTab('wallet');
      setNotifications([
        {
          id: 'init-notif-1',
          type: 'success',
          category: 'Food & Dining',
          title: 'Budget Healthy (GREEN)',
          message: 'Food & Dining budget is safe at $90.95 of $400.00 limit.',
          timestamp: new Date().toISOString(),
          isRead: false
        }
      ]);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-8 px-4 font-sans antialiased text-apple-gray-500 transition-all duration-700 ease-in-out"
      style={{ background: activeBgStyle }}
    >
      {/* Device frame container imitating Apple Style luxury */}
      <div className="w-full max-w-[420px] rounded-[48px] bg-apple-gray-50 shadow-2xl border-[10px] border-apple-gray-100 overflow-hidden relative flex flex-col h-[880px]">
        
        {/* Apple Status Bar */}
        <div className="bg-apple-gray-50 px-8 pt-4 pb-2 flex justify-between items-center text-xs font-semibold tracking-tight text-apple-gray-600 select-none">
          <span className="font-display font-bold text-[13px] text-apple-gray-600">{currentTime || '09:41 AM'}</span>
          {/* Dynamic Island style center dot */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4 w-28 h-5.5 bg-[#050505] rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full ml-auto mr-4" />
          </div>
          <div className="flex items-center gap-1.5 text-apple-gray-400">
            <Signal className="h-3.5 w-3.5 stroke-[2.5]" />
            <span className="text-[10px] font-bold">5G</span>
            <Wifi className="h-3.5 w-3.5 stroke-[2.5]" />
            <Battery className="h-4 w-4 stroke-[2.5] text-apple-gray-600" />
          </div>
        </div>

        {/* Dynamic Warning Notification Pill (Red if Above Budget, Green if Below Budget) - Clickable to open Notification Center */}
        <div className="px-5 pt-1">
          <AnimatePresence mode="wait">
            {isGlobalOverBudget ? (
              <motion.div
                key="alert-red"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={toggleNotifications}
                className="flex items-center gap-2.5 rounded-2xl bg-red-950/30 border border-red-900 p-3 text-red-200 shadow-xs cursor-pointer hover:bg-red-950/40 transition-all"
              >
                <AlertTriangle className="h-4.5 w-4.5 text-apple-red shrink-0 animate-bounce" />
                <div className="text-[11px] leading-tight flex-1">
                  <span className="font-bold block text-[#EF4444]">Over Budget Alert (RED)</span>
                  <span className="text-apple-gray-400">Total spending of {currencySymbol}{globalBudgetSpent.toFixed(2)} exceeds {currencySymbol}{globalBudgetLimit.toFixed(2)} limit! Click to view.</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="alert-green"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={toggleNotifications}
                className="flex items-center gap-2.5 rounded-2xl bg-emerald-950/20 border border-emerald-900 p-3 text-emerald-200 shadow-xs cursor-pointer hover:bg-emerald-950/30 transition-all"
              >
                <CheckCircle2 className="h-4.5 w-4.5 text-apple-green shrink-0" />
                <div className="text-[11px] leading-tight flex-1">
                  <span className="font-bold block text-[#22C55E]">Healthy Budget (GREEN)</span>
                  <span className="text-apple-gray-400">Total spending is safe at {globalBudgetLimit > 0 ? ((globalBudgetSpent / globalBudgetLimit) * 100).toFixed(0) : 0}% of targets! Click to view.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Header / Greeting */}
        <div className="px-6 pt-4 pb-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-apple-gold/70 font-semibold uppercase tracking-[0.2em] block">Apple Store Wallet</span>
            <h1 className="font-serif font-light text-2xl text-apple-gold tracking-wide mt-0.5">{getGreeting()}</h1>
          </div>
          
          <div className="flex gap-2">
            {/* Notification Bell with Badge */}
            <button
              onClick={toggleNotifications}
              title="Notifications"
              className="p-2.5 rounded-full bg-apple-gray-100 text-apple-gray-400 hover:text-apple-gold hover:bg-apple-gray-200 transition active:scale-95 relative cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-apple-red animate-pulse" />
              )}
            </button>

            {/* Quick Sandbox Reset */}
            <button
              onClick={handleResetSandbox}
              title="Reset Sandbox Data"
              className="p-2.5 rounded-full bg-apple-gray-100 text-apple-gray-400 hover:text-apple-gold hover:bg-apple-gray-200 transition active:scale-95 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {/* Settings Trigger Avatar with dynamic initials */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Profile & Theme Settings"
              className="h-9 w-9 rounded-full bg-gradient-to-tr from-apple-gold-dark to-apple-gold flex items-center justify-center text-black text-xs font-bold shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              {profileName.trim() ? profileName.trim().slice(0, 2).toUpperCase() : 'AI'}
            </button>
          </div>
        </div>

        {/* iOS Notification Center Drawer Overlay */}
        <AnimatePresence>
          {isNotificationOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute inset-x-0 top-0 bg-apple-gray-50/95 backdrop-blur-lg border-b border-apple-gray-100 z-50 overflow-hidden shadow-2xl rounded-t-[38px] pt-14 pb-5 flex flex-col"
            >
              <div className="px-6 pb-4 flex justify-between items-center border-b border-apple-gray-100">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-apple-gold animate-ping" />
                  <h3 className="font-serif font-light text-base text-apple-gold tracking-wider">Notification Center</h3>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleClearAllNotifications}
                    className="text-[10px] uppercase tracking-wider font-semibold text-apple-gray-300 hover:text-apple-gold transition cursor-pointer"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsNotificationOpen(false)}
                    className="text-[10px] uppercase tracking-wider font-bold text-apple-gold hover:text-apple-gold-dark transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 no-scrollbar max-h-[350px]">
                {notifications.length === 0 ? (
                  <div className="text-center py-10 text-apple-gray-400 text-xs font-medium space-y-1">
                    <p>No recent notifications</p>
                    <p className="text-[10px] text-apple-gray-350 font-light">Your budget updates will appear here.</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className={`rounded-2xl p-4 border transition-all ${
                        notif.type === 'danger'
                          ? 'bg-red-950/15 border-red-900/40 text-red-200'
                          : 'bg-emerald-950/10 border-emerald-900/30 text-emerald-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notif.type === 'danger' ? (
                          <div className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/30 text-apple-red">
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded-lg bg-emerald-950/20 border border-emerald-900/20 text-apple-green">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex justify-between items-start mb-0.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-apple-gold/80">{notif.category}</span>
                            <span className="text-[9px] text-apple-gray-300 font-mono">{new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <h4 className="text-xs font-bold text-[#F5F5F5]">{notif.title}</h4>
                          <p className="text-[11px] text-apple-gray-400 mt-1 leading-relaxed">{notif.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* iOS Settings & Customization Drawer Overlay */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute inset-x-0 top-0 bg-apple-gray-50/98 backdrop-blur-lg border-b border-apple-gray-100 z-50 overflow-hidden shadow-2xl rounded-t-[38px] pt-14 pb-6 flex flex-col"
            >
              {/* Settings Header */}
              <div className="px-6 pb-4 flex justify-between items-center border-b border-apple-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4.5 w-4.5 text-apple-gold" />
                  <h3 className="font-serif font-light text-base text-apple-gold tracking-wider">System Settings</h3>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-[10px] uppercase tracking-wider font-bold text-apple-gold hover:text-apple-gold-dark transition cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Scrollable Settings Options */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 no-scrollbar max-h-[460px] text-left">
                
                {/* Profile Edit Section */}
                <div className="rounded-2xl bg-apple-gray-100 p-4 border border-apple-gray-200 space-y-3.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-apple-gold/80">User Profile</h4>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-apple-gold-dark to-apple-gold flex items-center justify-center text-black text-base font-extrabold shadow-md shrink-0">
                      {profileName.trim() ? profileName.trim().slice(0, 2).toUpperCase() : 'AI'}
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="block text-[9px] font-semibold text-apple-gray-300 uppercase tracking-wider">Cardholder Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full text-xs rounded-xl border border-apple-gray-200 bg-apple-gray-50 text-apple-gray-600 px-3 py-2 outline-none focus:border-apple-gold transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Theme Customization Section */}
                <div className="rounded-2xl bg-apple-gray-100 p-4 border border-apple-gray-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-apple-gold/80">Theme Customization</h4>
                    <span className="text-[9px] font-mono text-apple-gray-300 bg-apple-gray-50 px-2 py-0.5 rounded-sm uppercase">
                      {activeThemeObj.name}
                    </span>
                  </div>

                  <p className="text-[10px] text-apple-gray-300 leading-relaxed">
                    Select a curated physical design layout style to personalize card metallics and visual accent highlights:
                  </p>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {THEMES.map((themeOption) => {
                      const isSelected = themeOption.id === themeDesign;
                      return (
                        <button
                          key={themeOption.id}
                          onClick={() => setThemeDesign(themeOption.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-apple-gold bg-apple-gray-50 text-apple-gray-600 shadow-sm scale-[1.01]' 
                              : 'border-apple-gray-200 bg-apple-gray-100 hover:border-apple-gray-200/55 text-apple-gray-400'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span 
                              style={{ backgroundColor: themeOption.dotColor }}
                              className="h-3 w-3 rounded-full border border-black/30 shadow-xs"
                            />
                            <span className="text-xs font-semibold">{themeOption.name}</span>
                          </div>
                          {isSelected && (
                            <span className="text-[9px] font-bold uppercase text-apple-gold bg-apple-gold/10 border border-apple-gold/20 px-2 py-0.5 rounded-sm">
                              Active
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Currency Customization Section */}
                <div className="rounded-2xl bg-apple-gray-100 p-4 border border-apple-gray-200 space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-apple-gold/80">Financial Currency</h4>
                  <p className="text-[10px] text-apple-gray-300 leading-relaxed">
                    Format all ledger balances, limits, and direct transfers to your localized currency region standard:
                  </p>
                  
                  <div className="grid grid-cols-4 gap-2.5 pt-1">
                    {CURRENCIES.map((currOption) => {
                      const isSelected = currOption.code === currency;
                      return (
                        <button
                          key={currOption.code}
                          onClick={() => setCurrency(currOption.code)}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-apple-gold bg-apple-gray-50 text-apple-gold shadow-sm font-bold' 
                              : 'border-apple-gray-200 bg-apple-gray-100 text-apple-gray-400 hover:border-apple-gold/30'
                          }`}
                        >
                          <span className="text-sm font-bold">{currOption.symbol}</span>
                          <span className="text-[8px] font-mono mt-0.5">{currOption.code}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Simulator Properties */}
                <div className="rounded-2xl bg-apple-gray-100 p-4 border border-apple-gray-200 space-y-2.5 text-[10px]">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-apple-gold/80 mb-1">Simulator Info</h4>
                  <div className="flex justify-between py-1 border-b border-apple-gray-200 text-apple-gray-300">
                    <span>OS Platform</span>
                    <span className="font-mono text-apple-gray-600">Apple Wallet iOS 19.4</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-apple-gray-200 text-apple-gray-300">
                    <span>Hardware Device</span>
                    <span className="font-mono text-apple-gray-600">iPhone 18 Pro Simulator</span>
                  </div>
                  <div className="flex justify-between py-1 text-apple-gray-300">
                    <span>Persistence Storage</span>
                    <span className="font-mono text-apple-green">Express Full-Stack API</span>
                  </div>
                </div>

                {/* Reset Buttons */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      handleResetSandbox();
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-900/50 bg-red-950/10 text-red-200 hover:bg-red-950/20 py-3 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Format Simulator Data
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Summary Strip */}
        <div className="px-6 pb-4 flex justify-between items-center text-xs text-apple-gray-300">
          <div className="flex items-center gap-1">
            <Link2 className="h-3.5 w-3.5 text-apple-gold/70" />
            <span>{connectedBanksCount} accounts linked</span>
          </div>
          <span className="font-mono text-[9px] font-bold bg-apple-gray-100 border border-apple-gray-200 text-apple-gold px-2 py-0.5 rounded-md">
            SANDBOX
          </span>
        </div>

        {/* View Content (Scrollable Container) */}
        <div className="flex-1 overflow-y-auto px-5 pb-24 no-scrollbar space-y-5">
          {activeTab === 'wallet' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-5"
            >
              {/* Apple Card visual block with mouse reflections */}
              <AppleCard
                accounts={accounts}
                activeAccountId={activeAccountId}
                onSelectAccount={setActiveAccountId}
                currencySymbol={currencySymbol}
                onAddAccount={() => setIsConnectModalOpen(true)}
                onSyncAccount={handleSyncAccount}
              />

              {/* Quick Actions Panel */}
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  onClick={() => setIsConnectModalOpen(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-transparent border border-apple-gold text-apple-gold p-4 font-semibold text-xs tracking-wider uppercase shadow-xs hover:bg-apple-gold hover:text-black active:scale-98 transition-all cursor-pointer"
                >
                  <Link2 className="h-4.5 w-4.5" />
                  Link Bank
                </button>
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-apple-gold p-4 font-semibold text-xs text-black tracking-wider uppercase shadow-md hover:bg-[#D5C18F] active:scale-98 transition-all cursor-pointer"
                >
                  <ArrowRightLeft className="h-4.5 w-4.5" />
                  Pay
                </button>
              </div>

              {/* Overall Budget Status Widget */}
              <div className="rounded-3xl bg-apple-gray-50 p-5 border border-apple-gray-100 shadow-xs space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif font-light text-xs text-apple-gold uppercase tracking-[0.15em]">Overall Budget Status</h3>
                  {isGlobalOverBudget ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-apple-red px-2.5 py-0.5 rounded-md bg-red-950/30 border border-red-900/30">
                      OVER LIMIT (RED)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-apple-green px-2.5 py-0.5 rounded-md bg-emerald-950/20 border border-emerald-900/30">
                      HEALTHY (GREEN)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-apple-gray-100 p-3 border border-apple-gray-200">
                    <span className="text-[9px] text-apple-gray-300 font-semibold uppercase tracking-wider">Target Limits</span>
                    <div className="text-lg font-semibold font-display text-apple-gray-600 mt-1">{currencySymbol}{globalBudgetLimit.toFixed(2)}</div>
                  </div>
                  <div className="rounded-2xl bg-apple-gray-100 p-3 border border-apple-gray-200">
                    <span className="text-[9px] text-apple-gray-300 font-semibold uppercase tracking-wider">Total Spent</span>
                    <div className={`text-lg font-semibold font-display mt-1 ${isGlobalOverBudget ? 'text-apple-red' : 'text-apple-green'}`}>
                      {currencySymbol}{globalBudgetSpent.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-semibold">
                    <span className="text-apple-gray-400">Total Utilization</span>
                    <span className={isGlobalOverBudget ? 'text-apple-red font-bold' : 'text-apple-green font-bold'}>
                      {globalBudgetLimit > 0 ? ((globalBudgetSpent / globalBudgetLimit) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-apple-gray-100 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.min((globalBudgetSpent / (globalBudgetLimit || 1)) * 100, 100)}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isGlobalOverBudget ? 'bg-apple-red' : 'bg-apple-green'
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-apple-gray-300 leading-relaxed">
                    {isGlobalOverBudget ? (
                      <span className="text-apple-red font-medium">You are currently over budget by {currencySymbol}{(globalBudgetSpent - globalBudgetLimit).toFixed(2)}.</span>
                    ) : (
                      <span>You have <span className="font-semibold text-apple-green">{currencySymbol}{(globalBudgetLimit - globalBudgetSpent).toFixed(2)}</span> remaining of your total limit.</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Transactions list header */}
              <div className="flex justify-between items-center pt-2">
                <h3 className="font-serif font-light text-lg text-apple-gray-600 tracking-wide">Recent Activity</h3>
                <span className="text-[10px] uppercase tracking-wider text-apple-gray-300 font-semibold">{transactions.length} items logged</span>
              </div>

              {/* Transaction list ledger */}
              <TransactionList
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
                currencySymbol={currencySymbol}
              />
            </motion.div>
          )}

          {activeTab === 'budget' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-light text-xl text-apple-gray-600 tracking-wide">Target Limits</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8E8E93]">Monthly Budgets</span>
              </div>

              {/* Budget visual components */}
              <BudgetManager
                budgets={budgets}
                onUpdateBudgetLimit={handleUpdateBudgetLimit}
                onAddBudget={handleAddBudget}
                currencySymbol={currencySymbol}
              />
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 pt-4 text-center"
            >
              <div className="flex justify-center mb-2">
                <div className="h-16 w-16 rounded-full bg-apple-gray-50 border border-apple-gray-100 flex items-center justify-center text-apple-gold shadow-lg">
                  <ArrowRightLeft className="h-8 w-8 stroke-[1.5]" />
                </div>
              </div>
              <h3 className="font-serif font-light text-xl text-apple-gold tracking-wide">Direct Transfer</h3>
              <p className="text-xs text-apple-gray-300 max-w-xs mx-auto leading-relaxed">
                Connect your cardholder accounts to make secure peer-to-peer transfers, buy from merchant sandboxes, and verify real-time budget effects.
              </p>

              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full rounded-2xl bg-apple-gold py-3.5 font-semibold text-xs text-black uppercase tracking-wider shadow-lg hover:bg-[#D5C18F] transition active:scale-98 cursor-pointer"
              >
                Launch Apple Pay Panel
              </button>

              <div className="pt-6 border-t border-apple-gray-100 space-y-3">
                <h4 className="text-xs font-semibold tracking-wider text-apple-gray-300 text-left">Quick Contacts</h4>
                <div className="flex gap-3 justify-center">
                  {INITIAL_CONTACTS.slice(0, 4).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setIsPaymentModalOpen(true);
                      }}
                      className="flex flex-col items-center gap-1 transition transform hover:scale-105"
                    >
                      <img
                        referrerPolicy="no-referrer"
                        src={c.avatarUrl}
                        alt={c.name}
                        className="h-10 w-10 rounded-full object-cover border border-apple-gray-200 shadow-xs"
                      />
                      <span className="text-[9px] text-apple-gray-400 font-medium truncate w-12">{c.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Apple iOS Styled Navigation Tab Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-apple-gray-50/85 backdrop-blur-md border-t border-apple-gray-100 px-6 py-4.5 flex justify-around items-center z-40">
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'wallet' ? 'text-apple-gold font-semibold' : 'text-apple-gray-300 hover:text-apple-gray-400'
            }`}
          >
            <Wallet className="h-5.5 w-5.5 stroke-[1.5]" />
            <span className="text-[9px] uppercase tracking-[0.1em]">Wallet</span>
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`flex flex-col items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'budget' ? 'text-apple-gold font-semibold' : 'text-apple-gray-300 hover:text-apple-gray-400'
            }`}
          >
            <PiggyBank className="h-5.5 w-5.5 stroke-[1.5]" />
            <span className="text-[9px] uppercase tracking-[0.1em]">Budgets</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`flex flex-col items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'payments' ? 'text-apple-gold font-semibold' : 'text-apple-gray-300 hover:text-apple-gray-400'
            }`}
          >
            <ArrowRightLeft className="h-5.5 w-5.5 stroke-[1.5]" />
            <span className="text-[9px] uppercase tracking-[0.1em]">Pay</span>
          </button>
        </div>

        {/* Interactive Modals */}
        <BankConnectionModal
          isOpen={isConnectModalOpen}
          onClose={() => setIsConnectModalOpen(false)}
          onConnect={handleConnectBank}
        />

        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          accounts={accounts}
          budgets={budgets}
          onExecutePayment={handleExecutePayment}
          currencySymbol={currencySymbol}
        />

      </div>
    </div>
  );
}
