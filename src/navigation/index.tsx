import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../screens/Dashboard';
import Transactions from '../screens/Transactions';
import Goals from '../screens/Goals';
import Settings from '../screens/Settings';

export type RootStackParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  Goals: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#6200ee',
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
          options={{ title: 'MyMoneyBox' }}
        />
        <Stack.Screen 
          name="Transactions" 
          component={Transactions}
          options={{ title: 'Transações' }}
        />
        <Stack.Screen 
          name="Goals" 
          component={Goals}
          options={{ title: 'Metas' }}
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

export default Navigation; 