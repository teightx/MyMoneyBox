import { DefaultTheme } from 'react-native-paper';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3',
    accent: '#03A9F4',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#212121',
    error: '#B00020',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3',
    disabled: '#9E9E9E',
    placeholder: '#9E9E9E',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#FF4081',
    // Cores específicas do app
    expense: '#FF5252',
    income: '#4CAF50',
    transfer: '#FF9800',
    card: '#FFFFFF',
    border: '#E0E0E0',
  },
  roundness: 8,
  animation: {
    scale: 1.0,
  },
};

export const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#90CAF9',
    accent: '#03A9F4',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    error: '#CF6679',
    success: '#81C784',
    warning: '#FFD54F',
    info: '#64B5F6',
    disabled: '#757575',
    placeholder: '#757575',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#FF4081',
    // Cores específicas do app
    expense: '#FF5252',
    income: '#81C784',
    transfer: '#FFB74D',
    card: '#1E1E1E',
    border: '#424242',
  },
  roundness: 8,
  animation: {
    scale: 1.0,
  },
}; 