import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  ProgressBar,
  FAB,
  Portal,
  Dialog,
  TextInput,
  Button,
  IconButton,
  useTheme,
  Text,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

const Goals: React.FC = () => {
  const { colors } = useTheme();
  const { goals, addGoal, updateGoal, deleteGoal } = useApp();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [color, setColor] = useState('#2196F3');

  const handleSave = async () => {
    if (!name || !targetAmount || !currentAmount) return;

    const goalData = {
      name,
      targetAmount: parseFloat(targetAmount.replace(',', '.')),
      currentAmount: parseFloat(currentAmount.replace(',', '.')),
      deadline: deadline.toISOString(),
      color,
    };

    if (editingGoal) {
      const goal = goals.find((g) => g.id === editingGoal);
      if (goal) {
        await updateGoal({
          ...goal,
          ...goalData,
        });
      }
    } else {
      await addGoal(goalData);
    }

    handleCloseDialog();
  };

  const handleEdit = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      setEditingGoal(goalId);
      setName(goal.name);
      setTargetAmount(goal.targetAmount.toString());
      setCurrentAmount(goal.currentAmount.toString());
      setDeadline(new Date(goal.deadline));
      setColor(goal.color);
      setDialogVisible(true);
    }
  };

  const handleDelete = async (goalId: string) => {
    await deleteGoal(goalId);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
    setEditingGoal(null);
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline(new Date());
    setColor('#2196F3');
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(current / target, 1);
  };

  const calculateRemainingDays = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineMedium">Metas</Text>
      <ScrollView>
        {goals.map((goal) => (
          <Card key={goal.id} style={styles.goalCard}>
            <Card.Content>
              <View style={styles.goalHeader}>
                <Title>{goal.name}</Title>
                <View style={styles.actionButtons}>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => handleEdit(goal.id)}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => handleDelete(goal.id)}
                  />
                </View>
              </View>

              <View style={styles.amountContainer}>
                <View>
                  <Paragraph>Progresso</Paragraph>
                  <Text style={styles.amount}>
                    {formatCurrency(goal.currentAmount)} /{' '}
                    {formatCurrency(goal.targetAmount)}
                  </Text>
                </View>
                <Text style={styles.percentage}>
                  {Math.round(
                    (goal.currentAmount / goal.targetAmount) * 100
                  )}%
                </Text>
              </View>

              <ProgressBar
                progress={calculateProgress(
                  goal.currentAmount,
                  goal.targetAmount
                )}
                color={goal.color}
                style={styles.progressBar}
              />

              <Paragraph style={styles.deadline}>
                {calculateRemainingDays(goal.deadline)} dias restantes
              </Paragraph>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={handleCloseDialog}>
          <Dialog.Title>
            {editingGoal ? 'Editar Meta' : 'Nova Meta'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nome da Meta"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              label="Valor Total"
              value={targetAmount}
              onChangeText={setTargetAmount}
              keyboardType="decimal-pad"
              style={styles.input}
              left={<TextInput.Affix text="R$" />}
            />
            <TextInput
              label="Valor Atual"
              value={currentAmount}
              onChangeText={setCurrentAmount}
              keyboardType="decimal-pad"
              style={styles.input}
              left={<TextInput.Affix text="R$" />}
            />
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.input}
            >
              Data Limite: {deadline.toLocaleDateString('pt-BR')}
            </Button>
            <TextInput
              label="Cor (Hex)"
              value={color}
              onChangeText={setColor}
              style={styles.input}
              placeholder="Ex: #2196F3"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCloseDialog}>Cancelar</Button>
            <Button onPress={handleSave}>Salvar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {showDatePicker && (
        <DateTimePicker
          value={deadline}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDeadline(selectedDate);
            }
          }}
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setDialogVisible(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  goalCard: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  deadline: {
    marginTop: 8,
    fontSize: 12,
    color: '#757575',
  },
  input: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default Goals; 