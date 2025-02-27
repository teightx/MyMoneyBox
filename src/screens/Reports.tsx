import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  useTheme,
  SegmentedButtons,
  Text,
} from 'react-native-paper';
import {
  VictoryPie,
  VictoryChart,
  VictoryLine,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
} from 'victory-native';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

type PeriodType = 'week' | 'month' | 'year';
type ChartType = 'expenses' | 'income' | 'balance';

const Reports = () => {
  const { colors } = useTheme();
  const { transactions, categories } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const [selectedChart, setSelectedChart] = useState<ChartType>('expenses');

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const periods = {
      week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      month: new Date(now.getFullYear(), now.getMonth(), 1),
      year: new Date(now.getFullYear(), 0, 1),
    };

    return transactions.filter(
      (t) => new Date(t.date) >= periods[selectedPeriod]
    );
  }, [transactions, selectedPeriod]);

  const categoryData = useMemo(() => {
    const data = categories.map((category) => {
      const total = filteredTransactions
        .filter(
          (t) =>
            t.categoryId === category.id &&
            t.type === (selectedChart === 'income' ? 'receita' : 'despesa')
        )
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        x: category.name,
        y: total,
        color: category.color,
      };
    });

    return data.filter((d) => d.y > 0);
  }, [filteredTransactions, categories, selectedChart]);

  const timelineData = useMemo(() => {
    const groupedData = new Map();

    filteredTransactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      let key;

      if (selectedPeriod === 'week') {
        key = date.toLocaleDateString('pt-BR', { weekday: 'short' });
      } else if (selectedPeriod === 'month') {
        key = date.getDate().toString();
      } else {
        key = date.toLocaleDateString('pt-BR', { month: 'short' });
      }

      if (!groupedData.has(key)) {
        groupedData.set(key, {
          expenses: 0,
          income: 0,
        });
      }

      const group = groupedData.get(key);
      if (transaction.type === 'receita') {
        group.income += transaction.amount;
      } else if (transaction.type === 'despesa') {
        group.expenses += transaction.amount;
      }
    });

    return Array.from(groupedData.entries()).map(([key, value]) => ({
      x: key,
      y:
        selectedChart === 'expenses'
          ? value.expenses
          : selectedChart === 'income'
          ? value.income
          : value.income - value.expenses,
    }));
  }, [filteredTransactions, selectedPeriod, selectedChart]);

  const totalAmount = useMemo(() => {
    return filteredTransactions.reduce((sum, transaction) => {
      if (selectedChart === 'expenses' && transaction.type === 'despesa') {
        return sum + transaction.amount;
      }
      if (selectedChart === 'income' && transaction.type === 'receita') {
        return sum + transaction.amount;
      }
      if (selectedChart === 'balance') {
        return (
          sum +
          (transaction.type === 'receita'
            ? transaction.amount
            : -transaction.amount)
        );
      }
      return sum;
    }, 0);
  }, [filteredTransactions, selectedChart]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title>Período</Title>
          <SegmentedButtons
            value={selectedPeriod}
            onValueChange={(value) =>
              setSelectedPeriod(value as PeriodType)
            }
            buttons={[
              { value: 'week', label: 'Semana' },
              { value: 'month', label: 'Mês' },
              { value: 'year', label: 'Ano' },
            ]}
            style={styles.segmentedButtons}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Tipo de Análise</Title>
          <SegmentedButtons
            value={selectedChart}
            onValueChange={(value) =>
              setSelectedChart(value as ChartType)
            }
            buttons={[
              { value: 'expenses', label: 'Despesas' },
              { value: 'income', label: 'Receitas' },
              { value: 'balance', label: 'Saldo' },
            ]}
            style={styles.segmentedButtons}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Total no Período</Title>
          <Paragraph style={styles.totalAmount}>
            {formatCurrency(totalAmount)}
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Distribuição por Categoria</Title>
          <View style={styles.chartContainer}>
            <VictoryPie
              data={categoryData}
              colorScale={categoryData.map((d) => d.color)}
              width={300}
              height={300}
              padding={50}
              labels={({ datum }) =>
                `${datum.x}\n${formatCurrency(datum.y)}`
              }
              style={{
                labels: {
                  fill: colors.text,
                  fontSize: 12,
                },
              }}
            />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Evolução no Tempo</Title>
          <View style={styles.chartContainer}>
            <VictoryChart
              width={350}
              height={250}
              theme={VictoryTheme.material}
              domainPadding={20}
            >
              <VictoryBar
                data={timelineData}
                style={{
                  data: {
                    fill: colors.primary,
                  },
                }}
                animate={{
                  duration: 500,
                }}
              />
              <VictoryAxis
                style={{
                  tickLabels: {
                    fill: colors.text,
                    fontSize: 10,
                  },
                }}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(tick) => formatCurrency(tick)}
                style={{
                  tickLabels: {
                    fill: colors.text,
                    fontSize: 10,
                  },
                }}
              />
            </VictoryChart>
          </View>
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
  segmentedButtons: {
    marginTop: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
});

export default Reports; 