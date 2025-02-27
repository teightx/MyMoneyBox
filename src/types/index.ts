export type TransactionType = 'EXPENSE' | 'INCOME';
export type RecurrenceInterval = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId: string;
  isRecurring?: boolean;
  recurrenceInterval?: RecurrenceInterval;
  tags?: string[];
  notes?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  color: string;
  icon: string;
  notes?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  spent: number;
  period: 'mensal' | 'anual';
  startDate: string;
  endDate: string;
}

export interface User {
  id: string;
  name: string;
  settings: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  currency: string;
  language: string;
  notifications: {
    enabled: boolean;
    budgetAlerts: boolean;
    goalReminders: boolean;
    billDueDate: boolean;
  };
  security: {
    biometricEnabled: boolean;
    pinEnabled: boolean;
    pin: string;
  };
  displayPreferences: {
    showBalance: boolean;
    defaultView: 'daily' | 'weekly' | 'monthly' | 'yearly';
    chartType: 'bar' | 'pie' | 'line';
  };
}

export interface DashboardData {
  balance: number;
  income: number;
  expenses: number;
  savings: number;
  recentTransactions: Transaction[];
  categoryTotals: {
    categoryId: string;
    total: number;
  }[];
  budgetProgress: {
    categoryId: string;
    percentage: number;
  }[];
} 