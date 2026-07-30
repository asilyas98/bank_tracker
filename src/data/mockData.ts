import { BankAccount, Transaction, Budget, Contact, BankConnection } from '../types';

export const POPULAR_BANKS: BankConnection[] = [
  { bankId: 'chase', name: 'Chase Bank', logoColor: 'bg-blue-600', popular: true },
  { bankId: 'bofa', name: 'Bank of America', logoColor: 'bg-red-600', popular: true },
  { bankId: 'wellsfargo', name: 'Wells Fargo', logoColor: 'bg-amber-600', popular: true },
  { bankId: 'citibank', name: 'Citi Bank', logoColor: 'bg-sky-500', popular: true },
  { bankId: 'apple', name: 'Apple Cash & Card', logoColor: 'bg-black', popular: true },
  { bankId: 'capitalone', name: 'Capital One', logoColor: 'bg-emerald-800', popular: false },
  { bankId: 'pnc', name: 'PNC Bank', logoColor: 'bg-orange-600', popular: false },
  { bankId: 'usbank', name: 'U.S. Bank', logoColor: 'bg-blue-800', popular: false },
  { bankId: 'fidelity', name: 'Fidelity', logoColor: 'bg-green-700', popular: false },
];

export const INITIAL_ACCOUNTS: BankAccount[] = [
  {
    id: 'acc-apple-cash',
    bankName: 'Apple Cash',
    accountName: 'Digital Balance',
    accountNumber: '•••• 1984',
    balance: 450.00,
    type: 'checking',
    isConnected: true,
    logoColor: 'bg-black',
  },
  {
    id: 'acc-chase-checking',
    bankName: 'Chase Bank',
    accountName: 'Total Checking',
    accountNumber: '•••• 8291',
    balance: 3420.50,
    type: 'checking',
    isConnected: true,
    logoColor: 'bg-blue-600',
  },
  {
    id: 'acc-bofa-savings',
    bankName: 'Bank of America',
    accountName: 'Preferred Savings',
    accountNumber: '•••• 4302',
    balance: 12500.00,
    type: 'savings',
    isConnected: true,
    logoColor: 'bg-red-600',
  },
  {
    id: 'acc-apple-card',
    bankName: 'Apple Card',
    accountName: 'Titanium Credit Card',
    accountNumber: '•••• 0124',
    balance: -840.20, // Negative for balance due / credit limit spending
    type: 'credit',
    isConnected: true,
    logoColor: 'bg-linear-to-tr from-slate-200 via-zinc-100 to-slate-300',
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    date: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    description: 'Apple Store Online',
    amount: -129.00,
    category: 'Shopping',
    accountId: 'acc-apple-card',
    status: 'completed',
  },
  {
    id: 'tx-2',
    date: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
    description: 'Whole Foods Market',
    amount: -84.20,
    category: 'Food & Dining',
    accountId: 'acc-chase-checking',
    status: 'completed',
  },
  {
    id: 'tx-3',
    date: new Date(Date.now() - 36 * 3600000).toISOString(), // 1.5 days ago
    description: 'Paycheck Direct Deposit',
    amount: 2450.00,
    category: 'Income',
    accountId: 'acc-chase-checking',
    status: 'completed',
  },
  {
    id: 'tx-4',
    date: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    description: 'Netflix Subscription',
    amount: -15.49,
    category: 'Entertainment',
    accountId: 'acc-apple-card',
    status: 'completed',
  },
  {
    id: 'tx-5',
    date: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
    description: 'Chevron Gas Station',
    amount: -45.00,
    category: 'Travel & Transport',
    accountId: 'acc-chase-checking',
    status: 'completed',
  },
  {
    id: 'tx-6',
    date: new Date(Date.now() - 7 * 86400000).toISOString(), // 7 days ago
    description: 'Starbucks Coffee',
    amount: -6.75,
    category: 'Food & Dining',
    accountId: 'acc-apple-cash',
    status: 'completed',
  },
  {
    id: 'tx-7',
    date: new Date(Date.now() - 8 * 86400000).toISOString(), // 8 days ago
    description: 'PG&E Utilities',
    amount: -112.40,
    category: 'Bills & Utilities',
    accountId: 'acc-chase-checking',
    status: 'completed',
  },
  {
    id: 'tx-8',
    date: new Date(Date.now() - 10 * 86400000).toISOString(), // 10 days ago
    description: 'Apple Music',
    amount: -10.99,
    category: 'Entertainment',
    accountId: 'acc-apple-card',
    status: 'completed',
  },
  {
    id: 'tx-9',
    date: new Date(Date.now() - 12 * 86400000).toISOString(), // 12 days ago
    description: 'Target Store',
    amount: -74.50,
    category: 'Shopping',
    accountId: 'acc-apple-card',
    status: 'completed',
  }
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'b-1',
    category: 'Food & Dining',
    limit: 400.00,
    spent: 90.95, // 84.20 + 6.75
    iconName: 'Utensils',
  },
  {
    id: 'b-2',
    category: 'Shopping',
    limit: 300.00,
    spent: 203.50, // 129.00 + 74.50
    iconName: 'ShoppingBag',
  },
  {
    id: 'b-3',
    category: 'Entertainment',
    limit: 100.00,
    spent: 26.48, // 15.49 + 10.99
    iconName: 'Clapperboard',
  },
  {
    id: 'b-4',
    category: 'Travel & Transport',
    limit: 150.00,
    spent: 45.00, // 45.00
    iconName: 'Car',
  },
  {
    id: 'b-5',
    category: 'Bills & Utilities',
    limit: 250.00,
    spent: 112.40, // 112.40
    iconName: 'Receipt',
  }
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c-1',
    name: 'Sarah Connor',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    phoneOrEmail: 'sarah.c@sky.net',
    bankName: 'Chase Bank',
  },
  {
    id: 'c-2',
    name: 'Marcus Aurelius',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    phoneOrEmail: 'marcus@stoic.org',
    bankName: 'Wells Fargo',
  },
  {
    id: 'c-3',
    name: 'Ada Lovelace',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    phoneOrEmail: 'ada@analytical.net',
    bankName: 'Apple Cash',
  },
  {
    id: 'c-4',
    name: 'Bruce Wayne',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    phoneOrEmail: 'bruce@waynecorp.com',
    bankName: 'Gotham City Bank',
  }
];
