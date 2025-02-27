import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  TextInput,
  Button,
  HelperText,
  useTheme,
  Switch,
  Text,
  Chip,
  IconButton,
  Portal,
  Dialog,
  RadioButton,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { TransactionType } from '../types';

type AddTransactionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AddTransaction'
>;

type AddTransactionScreenRouteProp = RouteProp<
  RootStackParamList,
  'AddTransaction'
>;

const AddTransaction = () => {
  const navigation = useNavigation<AddTransactionScreenNavigationProp>();
  const route = useRoute<AddTransactionScreenRouteProp>();
  const { colors } = useTheme();
  const { addTransaction, categories } = useApp();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type] = useState<TransactionType>(
    route.params?.type || 'despesa'
  );
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<
    'diaria' | 'semanal' | 'mensal' | 'anual'
  >('mensal');
  const [showRecurrenceDialog, setShowRecurrenceDialog] = useState(false);

  const handleSubmit = async () => {
    if (!description || !amount || !categoryId) {
      return;
    }

    await addTransaction({
      type,
      description,
      amount: parseFloat(amount.replace(',', '.')),
      date: date.toISOString(),
      categoryId,
      tags,
      recurrent: isRecurrent,
      recurrenceInfo: isRecurrent
        ? {
            frequency: recurrenceFrequency,
          }
        : undefined,
    });

    navigation.goBack();
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <TextInput
        label="Descrição"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <HelperText type="error" visible={!description}>
        A descrição é obrigatória
      </HelperText>

      <TextInput
        label="Valor"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        style={styles.input}
        left={<TextInput.Affix text="R$" />}
      />
      <HelperText type="error" visible={!amount}>
        O valor é obrigatório
      </HelperText>

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.input}
      >
        {date.toLocaleDateString('pt-BR')}
      </Button>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}

      <View style={styles.categoryContainer}>
        <Text>Categoria</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories
            .filter((category) => category.type === type)
            .map((category) => (
              <Chip
                key={category.id}
                selected={category.id === categoryId}
                onPress={() => setCategoryId(category.id)}
                style={styles.categoryChip}
              >
                {category.name}
              </Chip>
            ))}
        </ScrollView>
      </View>
      <HelperText type="error" visible={!categoryId}>
        Selecione uma categoria
      </HelperText>

      <View style={styles.tagsContainer}>
        <View style={styles.tagInput}>
          <TextInput
            label="Tags"
            value={newTag}
            onChangeText={setNewTag}
            style={styles.tagInputField}
          />
          <IconButton icon="plus" onPress={handleAddTag} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              onClose={() => handleRemoveTag(tag)}
              style={styles.tag}
            >
              {tag}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <View style={styles.recurrentContainer}>
        <Text>Transação Recorrente</Text>
        <Switch
          value={isRecurrent}
          onValueChange={setIsRecurrent}
        />
      </View>

      {isRecurrent && (
        <Button
          mode="outlined"
          onPress={() => setShowRecurrenceDialog(true)}
          style={styles.input}
        >
          Frequência: {recurrenceFrequency}
        </Button>
      )}

      <Portal>
        <Dialog
          visible={showRecurrenceDialog}
          onDismiss={() => setShowRecurrenceDialog(false)}
        >
          <Dialog.Title>Frequência da Recorrência</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(value) =>
                setRecurrenceFrequency(value as typeof recurrenceFrequency)
              }
              value={recurrenceFrequency}
            >
              <RadioButton.Item label="Diária" value="diaria" />
              <RadioButton.Item label="Semanal" value="semanal" />
              <RadioButton.Item label="Mensal" value="mensal" />
              <RadioButton.Item label="Anual" value="anual" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowRecurrenceDialog(false)}>
              Confirmar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        disabled={!description || !amount || !categoryId}
      >
        Salvar
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  categoryContainer: {
    marginVertical: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  tagsContainer: {
    marginVertical: 16,
  },
  tagInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagInputField: {
    flex: 1,
    marginRight: 8,
  },
  tag: {
    marginRight: 8,
  },
  recurrentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default AddTransaction; 