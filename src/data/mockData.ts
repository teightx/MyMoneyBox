import { Category, Transaction, Goal, UserSettings } from '../types';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Alimentação',
    type: 'EXPENSE',
    color: '#FF6B6B',
    icon: 'food',
  },
  {
    id: '2',
    name: 'Transporte',
    type: 'EXPENSE',
    color: '#4ECDC4',
    icon: 'car',
  },
  {
    id: '3',
    name: 'Moradia',
    type: 'EXPENSE',
    color: '#45B7D1',
    icon: 'home',
  },
  {
    id: '4',
    name: 'Lazer',
    type: 'EXPENSE',
    color: '#96CEB4',
    icon: 'movie',
  },
  {
    id: '5',
    name: 'Salário',
    type: 'INCOME',
    color: '#2ECC71',
    icon: 'cash',
  },
  {
    id: '6',
    name: 'Freelance',
    type: 'INCOME',
    color: '#26C6DA',
    icon: 'laptop',
  },
  {
    id: '7',
    name: 'Investimentos',
    type: 'INCOME',
    color: '#F4D03F',
    icon: 'chart-line',
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Supermercado Mensal',
    amount: 850.00,
    date: '2024-03-15',
    type: 'EXPENSE',
    categoryId: '1',
    isRecurring: true,
    recurrenceInterval: 'monthly',
    tags: ['essencial', 'casa'],
    notes: 'Compras do mês no Carrefour'
  },
  {
    id: '2',
    description: 'Salário',
    amount: 5000.00,
    date: '2024-03-05',
    type: 'INCOME',
    categoryId: '5',
    isRecurring: true,
    recurrenceInterval: 'monthly',
    tags: ['fixo'],
    notes: 'Salário mensal'
  },
  {
    id: '3',
    description: 'Aluguel',
    amount: 1500.00,
    date: '2024-03-10',
    type: 'EXPENSE',
    categoryId: '3',
    isRecurring: true,
    recurrenceInterval: 'monthly',
    tags: ['moradia', 'fixo'],
    notes: 'Aluguel do apartamento'
  },
  {
    id: '4',
    description: 'Projeto Freelance',
    amount: 2500.00,
    date: '2024-03-20',
    type: 'INCOME',
    categoryId: '6',
    isRecurring: false,
    tags: ['extra', 'desenvolvimento'],
    notes: 'Desenvolvimento de website para cliente'
  },
  {
    id: '5',
    description: 'Cinema com amigos',
    amount: 120.00,
    date: '2024-03-18',
    type: 'EXPENSE',
    categoryId: '4',
    isRecurring: false,
    tags: ['lazer', 'amigos'],
    notes: 'Filme + pipoca'
  },
  {
    id: '6',
    description: 'Dividendos',
    amount: 350.00,
    date: '2024-03-12',
    type: 'INCOME',
    categoryId: '7',
    isRecurring: true,
    recurrenceInterval: 'monthly',
    tags: ['investimentos'],
    notes: 'Dividendos de ações'
  },
  {
    id: '7',
    description: 'Uber',
    amount: 25.50,
    date: '2024-03-17',
    type: 'EXPENSE',
    categoryId: '2',
    isRecurring: false,
    tags: ['transporte'],
    notes: 'Corrida para o trabalho'
  }
];

export const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Fundo de Emergência',
    targetAmount: 15000.00,
    currentAmount: 8500.00,
    deadline: '2024-12-31',
    category: 'savings',
    color: '#2ECC71',
    icon: 'shield',
    notes: 'Reserva para 6 meses de despesas'
  },
  {
    id: '2',
    name: 'Viagem para Europa',
    targetAmount: 12000.00,
    currentAmount: 4500.00,
    deadline: '2025-07-15',
    category: 'travel',
    color: '#3498DB',
    icon: 'airplane',
    notes: 'Férias de 2025'
  },
  {
    id: '3',
    name: 'Novo Notebook',
    targetAmount: 8000.00,
    currentAmount: 2000.00,
    deadline: '2024-09-30',
    category: 'electronics',
    color: '#9B59B6',
    icon: 'laptop',
    notes: 'MacBook para trabalho'
  }
];

export const mockUserSettings: UserSettings = {
  theme: 'light',
  currency: 'BRL',
  language: 'pt-BR',
  notifications: {
    enabled: true,
    budgetAlerts: true,
    goalReminders: true,
    billDueDate: true
  },
  security: {
    biometricEnabled: true,
    pinEnabled: true,
    pin: '123456'
  },
  displayPreferences: {
    showBalance: true,
    defaultView: 'monthly',
    chartType: 'bar'
  }
}; 