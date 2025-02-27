import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';

// Importação das telas
import Dashboard from '../screens/Dashboard';
import Transactions from '../screens/Transactions';
import AddTransaction from '../screens/AddTransaction';
import Categories from '../screens/Categories';
import Goals from '../screens/Goals';
import Reports from '../screens/Reports';
import Settings from '../screens/Settings';

export type RootStackParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  AddTransaction: { type?: 'receita' | 'despesa' | 'transferencia' };
  Categories: undefined;
  Goals: undefined;
  Reports: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { theme } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme === 'dark' ? '#121212' : '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ title: 'Meu Painel' }}
        />
        <Stack.Screen
          name="Transactions"
          component={Transactions}
          options={{ title: 'Transações' }}
        />
        <Stack.Screen
          name="AddTransaction"
          component={AddTransaction}
          options={{ title: 'Nova Transação' }}
        />
        <Stack.Screen
          name="Categories"
          component={Categories}
          options={{ title: 'Categorias' }}
        />
        <Stack.Screen
          name="Goals"
          component={Goals}
          options={{ title: 'Metas' }}
        />
        <Stack.Screen
          name="Reports"
          component={Reports}
          options={{ title: 'Relatórios' }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ title: 'Configurações' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 