import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  List,
  FAB,
  Portal,
  Dialog,
  TextInput,
  Button,
  IconButton,
  useTheme,
  SegmentedButtons,
} from 'react-native-paper';
import { useApp } from '../context/AppContext';
import { TransactionType } from '../types';

const Categories = () => {
  const { colors } = useTheme();
  const { categories, addCategory, updateCategory, deleteCategory } = useApp();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('#2196F3');
  const [type, setType] = useState<TransactionType>('despesa');

  const handleSave = async () => {
    if (!name || !icon) return;

    if (editingCategory) {
      const category = categories.find((c) => c.id === editingCategory);
      if (category) {
        await updateCategory({
          ...category,
          name,
          icon,
          color,
          type,
        });
      }
    } else {
      await addCategory({
        name,
        icon,
        color,
        type,
      });
    }

    handleCloseDialog();
  };

  const handleEdit = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setEditingCategory(categoryId);
      setName(category.name);
      setIcon(category.icon);
      setColor(category.color);
      setType(category.type);
      setDialogVisible(true);
    }
  };

  const handleDelete = async (categoryId: string) => {
    await deleteCategory(categoryId);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
    setEditingCategory(null);
    setName('');
    setIcon('');
    setColor('#2196F3');
    setType('despesa');
  };

  const renderCategoryList = (categoryType: TransactionType) => {
    return categories
      .filter((category) => category.type === categoryType)
      .map((category) => (
        <List.Item
          key={category.id}
          title={category.name}
          left={(props) => (
            <List.Icon {...props} icon={category.icon} color={category.color} />
          )}
          right={(props) => (
            <View style={styles.actionButtons}>
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => handleEdit(category.id)}
              />
              <IconButton
                icon="delete"
                size={20}
                onPress={() => handleDelete(category.id)}
              />
            </View>
          )}
        />
      ));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <List.Section>
          <List.Subheader>Categorias de Despesas</List.Subheader>
          {renderCategoryList('despesa')}
        </List.Section>

        <List.Section>
          <List.Subheader>Categorias de Receitas</List.Subheader>
          {renderCategoryList('receita')}
        </List.Section>

        <List.Section>
          <List.Subheader>Categorias de Transferências</List.Subheader>
          {renderCategoryList('transferencia')}
        </List.Section>
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={handleCloseDialog}>
          <Dialog.Title>
            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nome"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              label="Ícone"
              value={icon}
              onChangeText={setIcon}
              style={styles.input}
              placeholder="Ex: home, shopping, food"
            />
            <TextInput
              label="Cor (Hex)"
              value={color}
              onChangeText={setColor}
              style={styles.input}
              placeholder="Ex: #2196F3"
            />
            <SegmentedButtons
              value={type}
              onValueChange={(value) =>
                setType(value as TransactionType)
              }
              buttons={[
                { value: 'despesa', label: 'Despesa' },
                { value: 'receita', label: 'Receita' },
                { value: 'transferencia', label: 'Transferência' },
              ]}
              style={styles.segmentedButtons}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCloseDialog}>Cancelar</Button>
            <Button onPress={handleSave}>Salvar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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
  },
  input: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default Categories; 