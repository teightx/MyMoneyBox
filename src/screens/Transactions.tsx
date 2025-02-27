import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Searchbar,
  Card,
  Title,
  Paragraph,
  Chip,
  FAB,
  useTheme,
  Menu,
  Divider,
  Text,
} from 'react-native-paper';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';

type TransactionsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Transactions'
>;

const Transactions: React.FC = () => {
  const navigation = useNavigation<TransactionsScreenNavigationProp>();
  const { colors } = useTheme();
  const { transactions, categories } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        const matchesSearch =
          transaction.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          formatCurrency(transaction.amount)
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesType = selectedType
          ? transaction.type === selectedType
          : true;

        return matchesSearch && matchesType;
      })
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [transactions, searchQuery, selectedType]);

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const category = categories.find((c) => c.id === item.categoryId);

    return (
      <Card style={styles.transactionCard}>
        <Card.Content>
          <View style={styles.transactionHeader}>
            <View>
              <Title>{item.description}</Title>
              <Paragraph style={styles.dateText}>
                {new Date(item.date).toLocaleDateString('pt-BR')}
              </Paragraph>
            </View>
            <Paragraph
              style={[
                styles.amount,
                {
                  color:
                    item.type === 'receita' ? colors.primary : colors.error,
                },
              ]}
            >
              {formatCurrency(item.amount)}
            </Paragraph>
          </View>
          <View style={styles.tagsContainer}>
            <Chip
              style={[
                styles.typeChip,
                {
                  backgroundColor:
                    item.type === 'receita'
                      ? colors.primary
                      : colors.error,
                },
              ]}
            >
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Chip>
            {category && (
              <Chip style={styles.categoryChip}>
                {category.name}
              </Chip>
            )}
            {item.tags.map((tag) => (
              <Chip key={tag} style={styles.tag}>
                {tag}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Transações</Text>
      <View style={styles.header}>
        <Searchbar
          placeholder="Pesquisar transações"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <View style={styles.filterChips}>
          <Chip
            selected={selectedType === null}
            onPress={() => setSelectedType(null)}
            style={styles.filterChip}
          >
            Todas
          </Chip>
          <Chip
            selected={selectedType === 'receita'}
            onPress={() => setSelectedType('receita')}
            style={styles.filterChip}
          >
            Receitas
          </Chip>
          <Chip
            selected={selectedType === 'despesa'}
            onPress={() => setSelectedType('despesa')}
            style={styles.filterChip}
          >
            Despesas
          </Chip>
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <FAB
        style={[styles.fab, { backgroundColor: colors.primary }]}
        icon="plus"
        onPress={() => setMenuVisible(true)}
      />

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={<View />}
        style={styles.menu}
      >
        <Menu.Item
          onPress={() => {
            navigation.navigate('AddTransaction', { type: 'receita' });
            setMenuVisible(false);
          }}
          title="Nova Receita"
        />
        <Menu.Item
          onPress={() => {
            navigation.navigate('AddTransaction', { type: 'despesa' });
            setMenuVisible(false);
          }}
          title="Nova Despesa"
        />
        <Divider />
        <Menu.Item
          onPress={() => {
            navigation.navigate('AddTransaction', { type: 'transferencia' });
            setMenuVisible(false);
          }}
          title="Nova Transferência"
        />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
  searchBar: {
    marginBottom: 8,
  },
  filterChips: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  list: {
    padding: 16,
  },
  transactionCard: {
    marginBottom: 8,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateText: {
    fontSize: 12,
    color: '#757575',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  typeChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E0E0E0',
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  menu: {
    position: 'absolute',
    bottom: 72,
    right: 16,
  },
});

export default Transactions; 