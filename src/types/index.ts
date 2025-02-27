export type TransactionType = 'receita' | 'despesa' | 'transferencia';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  tags: string[];
  recurrent: boolean;
  recurrenceInfo?: {
    frequency: 'diaria' | 'semanal' | 'mensal' | 'anual';
    endDate?: string;
  };
  attachments?: string[]; // Base64 das imagens
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
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
  settings: {
    theme: 'light' | 'dark';
    currency: string;
    useBiometrics: boolean;
    notifications: boolean;
    language: string;
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