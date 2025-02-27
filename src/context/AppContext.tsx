import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Category, Goal, Budget, User, DashboardData, UserSettings } from '../types';
import { mockCategories, mockTransactions, mockGoals, mockUserSettings } from '../data/mockData';

interface AppContextData {
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
  budgets: Budget[];
  user: User | null;
  dashboardData: DashboardData;
  theme: 'light' | 'dark';
  userSettings: UserSettings;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addGoal: (goal: Goal) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  toggleTheme: () => Promise<void>;
  calculateDashboardData: () => void;
  updateUserSettings: (settings: UserSettings) => Promise<void>;
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
  const [userSettings, setUserSettings] = useState<UserSettings>(mockUserSettings);

  const loadInitialData = useCallback(async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem('@MyMoneyBox:transactions');
      const storedCategories = await AsyncStorage.getItem('@MyMoneyBox:categories');
      const storedGoals = await AsyncStorage.getItem('@MyMoneyBox:goals');
      const storedBudgets = await AsyncStorage.getItem('@MyMoneyBox:budgets');
      const storedUser = await AsyncStorage.getItem('@MyMoneyBox:user');
      const storedTheme = await AsyncStorage.getItem('@MyMoneyBox:theme');
      const storedSettings = await AsyncStorage.getItem('@MyMoneyBox:settings');

      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
      if (storedCategories) setCategories(JSON.parse(storedCategories));
      if (storedGoals) setGoals(JSON.parse(storedGoals));
      if (storedBudgets) setBudgets(JSON.parse(storedBudgets));
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedTheme) setTheme(storedTheme as 'light' | 'dark');
      if (storedSettings) setUserSettings(JSON.parse(storedSettings));

      calculateDashboardData();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

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

  const addTransaction = async (transaction: Transaction) => {
    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    await AsyncStorage.setItem('@MyMoneyBox:transactions', JSON.stringify(updatedTransactions));
    calculateDashboardData();
  };

  const updateTransaction = async (transaction: Transaction) => {
    const updatedTransactions = transactions.map(t => 
      t.id === transaction.id ? transaction : t
    );
    setTransactions(updatedTransactions);
    await AsyncStorage.setItem('@MyMoneyBox:transactions', JSON.stringify(updatedTransactions));
    calculateDashboardData();
  };

  const deleteTransaction = async (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    await AsyncStorage.setItem('@MyMoneyBox:transactions', JSON.stringify(updatedTransactions));
    calculateDashboardData();
  };

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    await AsyncStorage.setItem('@MyMoneyBox:categories', JSON.stringify(updatedCategories));
  };

  const updateCategory = async (category: Category) => {
    const updatedCategories = categories.map(c =>
      c.id === category.id ? category : c
    );
    setCategories(updatedCategories);
    await AsyncStorage.setItem('@MyMoneyBox:categories', JSON.stringify(updatedCategories));
  };

  const deleteCategory = async (id: string) => {
    const updatedCategories = categories.filter(c => c.id !== id);
    setCategories(updatedCategories);
    await AsyncStorage.setItem('@MyMoneyBox:categories', JSON.stringify(updatedCategories));
  };

  const addGoal = async (goal: Goal) => {
    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    await AsyncStorage.setItem('@MyMoneyBox:goals', JSON.stringify(updatedGoals));
    calculateDashboardData();
  };

  const updateGoal = async (goal: Goal) => {
    const updatedGoals = goals.map(g => 
      g.id === goal.id ? goal : g
    );
    setGoals(updatedGoals);
    await AsyncStorage.setItem('@MyMoneyBox:goals', JSON.stringify(updatedGoals));
    calculateDashboardData();
  };

  const deleteGoal = async (id: string) => {
    const updatedGoals = goals.filter(g => g.id !== id);
    setGoals(updatedGoals);
    await AsyncStorage.setItem('@MyMoneyBox:goals', JSON.stringify(updatedGoals));
    calculateDashboardData();
  };

  const updateUser = async (userData: Partial<User>) => {
    const updatedUser = user ? { ...user, ...userData } : { id: Date.now().toString(), ...userData };
    setUser(updatedUser as User);
    await AsyncStorage.setItem('@MyMoneyBox:user', JSON.stringify(updatedUser));
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('@MyMoneyBox:theme', newTheme);
  };

  const updateUserSettings = async (settings: UserSettings) => {
    setUserSettings(settings);
    await AsyncStorage.setItem('@MyMoneyBox:settings', JSON.stringify(settings));
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
        userSettings,
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
        updateUserSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 