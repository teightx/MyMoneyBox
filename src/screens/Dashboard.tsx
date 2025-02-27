import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card, Title, Paragraph, Button, useTheme, Text } from 'react-native-paper';
import { VictoryPie, VictoryChart, VictoryLine, VictoryAxis } from 'victory-native';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { formatCurrency } from '../utils/formatters';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

const Dashboard: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { colors } = useTheme();
  const {
    dashboardData: {
      balance,
      income,
      expenses,
      recentTransactions,
      categoryTotals,
      budgetProgress,
    },
  } = useApp();

  const pieChartData = categoryTotals.map((category) => ({
    x: category.categoryId,
    y: category.total,
  }));

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Dashboard</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 16,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  column: {
    flex: 1,
  },
  incomeText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  expenseText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 12,
    color: '#757575',
  },
  amount: {
    fontWeight: 'bold',
  },
});

export default Dashboard; 