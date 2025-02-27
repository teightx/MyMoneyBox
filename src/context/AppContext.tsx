import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Category, Goal, Budget, User, DashboardData } from '../types';

interface AppContextData {
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
  budgets: Budget[];
  user: User | null;
  dashboardData: DashboardData;
  theme: 'light' | 'dark';
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  toggleTheme: () => Promise<void>;
  calculateDashboardData: () => void;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    balance: 0,
    income: 0,
    expenses: 0,
    savings: 0,
    recentTransactions: [],
    categoryTotals: [],
    budgetProgress: [],
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem('transactions');
      const storedCategories = await AsyncStorage.getItem('categories');
      const storedGoals = await AsyncStorage.getItem('goals');
      const storedBudgets = await AsyncStorage.getItem('budgets');
      const storedUser = await AsyncStorage.getItem('user');
      const storedTheme = await AsyncStorage.getItem('theme');

      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
      if (storedCategories) setCategories(JSON.parse(storedCategories));
      if (storedGoals) setGoals(JSON.parse(storedGoals));
      if (storedBudgets) setBudgets(JSON.parse(storedBudgets));
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedTheme) setTheme(storedTheme as 'light' | 'dark');

      calculateDashboardData();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const calculateDashboardData = () => {
    const income = transactions
      .filter(t => t.type === 'receita')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'despesa')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const balance = income - expenses;
    const savings = goals.reduce((acc, curr) => acc + curr.currentAmount, 0);

    const categoryTotals = categories.map(category => ({
      categoryId: category.id,
      total: transactions
        .filter(t => t.categoryId === category.id)
        .reduce((acc, curr) => acc + curr.amount, 0),
    }));

    const budgetProgress = budgets.map(budget => {
      const spent = transactions
        .filter(t => t.categoryId === budget.categoryId)
        .reduce((acc, curr) => acc + curr.amount, 0);
      return {
        categoryId: budget.categoryId,
        percentage: (spent / budget.amount) * 100,
      };
    });

    setDashboardData({
      balance,
      income,
      expenses,
      savings,
      recentTransactions: transactions.slice(-5),
      categoryTotals,
      budgetProgress,
    });
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    calculateDashboardData();
  };

  const updateTransaction = async (transaction: Transaction) => {
    const updatedTransactions = transactions.map(t =>
      t.id === transaction.id ? { ...transaction, updatedAt: new Date().toISOString() } : t
    );
    setTransactions(updatedTransactions);
    await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    calculateDashboardData();
  };

  const deleteTransaction = async (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    calculateDashboardData();
  };

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  const updateCategory = async (category: Category) => {
    const updatedCategories = categories.map(c =>
      c.id === category.id ? category : c
    );
    setCategories(updatedCategories);
    await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  const deleteCategory = async (id: string) => {
    const updatedCategories = categories.filter(c => c.id !== id);
    setCategories(updatedCategories);
    await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  const addGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    calculateDashboardData();
  };

  const updateGoal = async (goal: Goal) => {
    const updatedGoals = goals.map(g =>
      g.id === goal.id ? { ...goal, updatedAt: new Date().toISOString() } : g
    );
    setGoals(updatedGoals);
    await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    calculateDashboardData();
  };

  const deleteGoal = async (id: string) => {
    const updatedGoals = goals.filter(g => g.id !== id);
    setGoals(updatedGoals);
    await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    calculateDashboardData();
  };

  const updateUser = async (userData: Partial<User>) => {
    const updatedUser = user ? { ...user, ...userData } : { id: Date.now().toString(), ...userData };
    setUser(updatedUser as User);
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        categories,
        goals,
        budgets,
        user,
        theme,
        dashboardData,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        addGoal,
        updateGoal,
        deleteGoal,
        updateUser,
        toggleTheme,
        calculateDashboardData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
}; 