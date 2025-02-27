import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './context/AppContext';
import Navigation from './navigation';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AppProvider>
          <Navigation />
        </AppProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App; 