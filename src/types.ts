export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  balance: number;
  type: 'checking' | 'savings' | 'credit';
  isConnected: boolean;
  logoColor: string; // Tailwinds color class or hex for nice Apple style
}

export interface Transaction {
  id: string;
  date: string; // ISO String
  description: string;
  amount: number; // Positive for income/credits, negative for expenses/debits
  category: string;
  accountId: string;
  status: 'completed' | 'pending';
  merchantLogo?: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  iconName: string; // Name of Lucide icon
}

export interface Contact {
  id: string;
  name: string;
  avatarUrl: string;
  phoneOrEmail: string;
  bankName?: string;
}

export interface BankConnection {
  bankId: string;
  name: string;
  logoColor: string;
  popular: boolean;
  requiresMfa?: boolean;
}

export interface AppNotification {
  id: string;
  type: 'danger' | 'success'; // danger = red, success = green
  category: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

