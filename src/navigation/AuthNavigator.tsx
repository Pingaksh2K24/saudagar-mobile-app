import React from 'react';
import { View } from 'react-native';
import { LoginScreen } from '../screens/Auth/LogIn/LoginScreen';

export const AuthNavigator: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <LoginScreen />
    </View>
  );
};