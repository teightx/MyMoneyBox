import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import { VictoryPie, VictoryChart, VictoryLine, VictoryAxis } from 'victory-native';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { formatCurrency } from '../utils/formatters';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

const Dashboard = () => {
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Cartão de Saldo */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Saldo Atual</Title>
          <Paragraph style={styles.balanceText}>
            {formatCurrency(balance)}
          </Paragraph>
          <View style={styles.row}>
            <View style={styles.column}>
              <Paragraph>Receitas</Paragraph>
              <Paragraph style={styles.incomeText}>
                {formatCurrency(income)}
              </Paragraph>
            </View>
            <View style={styles.column}>
              <Paragraph>Despesas</Paragraph>
              <Paragraph style={styles.expenseText}>
                {formatCurrency(expenses)}
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Gráfico de Categorias */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Gastos por Categoria</Title>
          <View style={styles.chartContainer}>
            <VictoryPie
              data={pieChartData}
              colorScale="qualitative"
              width={300}
              height={300}
              padding={50}
              labels={({ datum }) => `${formatCurrency(datum.y)}`}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Gráfico de Evolução */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Evolução do Saldo</Title>
          <View style={styles.chartContainer}>
            <VictoryChart width={350} height={250}>
              <VictoryLine
                style={{
                  data: { stroke: colors.primary },
                }}
                data={[
                  { x: 1, y: balance - expenses },
                  { x: 2, y: balance - expenses / 2 },
                  { x: 3, y: balance },
                ]}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(tick) => formatCurrency(tick)}
              />
              <VictoryAxis
                tickFormat={(tick) => `Semana ${tick}`}
              />
            </VictoryChart>
          </View>
        </Card.Content>
      </Card>

      {/* Botões de Ação Rápida */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AddTransaction', { type: 'receita' })}
          style={styles.button}
        >
          Nova Receita
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AddTransaction', { type: 'despesa' })}
          style={styles.button}
        >
          Nova Despesa
        </Button>
      </View>

      {/* Transações Recentes */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Transações Recentes</Title>
          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View>
                <Paragraph>{transaction.description}</Paragraph>
                <Paragraph style={styles.dateText}>
                  {new Date(transaction.date).toLocaleDateString()}
                </Paragraph>
              </View>
              <Paragraph
                style={[
                  styles.amount,
                  {
                    color:
                      transaction.type === 'receita'
                        ? colors.success
                        : colors.error,
                  },
                ]}
              >
                {formatCurrency(transaction.amount)}
              </Paragraph>
            </View>
          ))}
          <Button
            mode="text"
            onPress={() => navigation.navigate('Transactions')}
          >
            Ver Todas as Transações
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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