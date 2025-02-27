import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppProvider } from './src/context/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { lightTheme, darkTheme } from './src/constants/theme';
import { useApp } from './src/context/AppContext';

const AppContent = () => {
  const { theme } = useApp();
  const paperTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar
        backgroundColor={paperTheme.colors.primary}
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <AppNavigator />
    </PaperProvider>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
