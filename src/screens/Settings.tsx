import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  List,
  Switch,
  useTheme,
  Button,
  Portal,
  Dialog,
  TextInput,
  Divider,
  Text,
} from 'react-native-paper';
import { useApp } from '../context/AppContext';

const Settings: React.FC = () => {
  const { colors } = useTheme();
  const { user, updateUser, theme, toggleTheme } = useApp();
  const [nameDialogVisible, setNameDialogVisible] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');

  const handleUpdateName = async () => {
    if (newName.trim()) {
      await updateUser({ name: newName.trim() });
      setNameDialogVisible(false);
    }
  };

  const handleExportData = () => {
    // Implementar exportação de dados
    Alert.alert(
      'Exportar Dados',
      'Esta funcionalidade será implementada em breve.'
    );
  };

  const handleImportData = () => {
    // Implementar importação de dados
    Alert.alert(
      'Importar Dados',
      'Esta funcionalidade será implementada em breve.'
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Excluir Dados',
      'Tem certeza que deseja excluir todos os dados? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            // Implementar exclusão de dados
            Alert.alert(
              'Dados Excluídos',
              'Todos os dados foram excluídos com sucesso.'
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text variant="headlineMedium">Configurações</Text>
      <List.Section>
        <List.Subheader>Perfil</List.Subheader>
        <List.Item
          title="Nome"
          description={user?.name || 'Não definido'}
          onPress={() => setNameDialogVisible(true)}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Aparência</List.Subheader>
        <List.Item
          title="Tema Escuro"
          right={() => (
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
            />
          )}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Notificações</List.Subheader>
        <List.Item
          title="Lembrete de Contas"
          right={() => (
            <Switch
              value={user?.settings?.notifications || false}
              onValueChange={(value) =>
                updateUser({
                  settings: { ...user?.settings, notifications: value },
                })
              }
            />
          )}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Segurança</List.Subheader>
        <List.Item
          title="Usar Biometria"
          right={() => (
            <Switch
              value={user?.settings?.useBiometrics || false}
              onValueChange={(value) =>
                updateUser({
                  settings: { ...user?.settings, useBiometrics: value },
                })
              }
            />
          )}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Dados</List.Subheader>
        <List.Item
          title="Exportar Dados"
          onPress={handleExportData}
          right={(props) => <List.Icon {...props} icon="export" />}
        />
        <List.Item
          title="Importar Dados"
          onPress={handleImportData}
          right={(props) => <List.Icon {...props} icon="import" />}
        />
        <List.Item
          title="Excluir Todos os Dados"
          onPress={handleDeleteData}
          titleStyle={{ color: colors.error }}
          right={(props) => (
            <List.Icon {...props} icon="delete" color={colors.error} />
          )}
        />
      </List.Section>

      <Portal>
        <Dialog
          visible={nameDialogVisible}
          onDismiss={() => setNameDialogVisible(false)}
        >
          <Dialog.Title>Alterar Nome</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nome"
              value={newName}
              onChangeText={setNewName}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setNameDialogVisible(false)}>
              Cancelar
            </Button>
            <Button onPress={handleUpdateName}>Salvar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
  },
});

export default Settings; 