import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { NotificationProvider } from './src/components/Notification/NotificationManager';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import './src/utils/suppressWarnings';

function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NotificationProvider>
          <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
          <AppNavigator />
        </NotificationProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;
