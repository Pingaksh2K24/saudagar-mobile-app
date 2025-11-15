import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { SplashScreen } from '../screens/Splash/SplashScreen';
import SecureStorage from '../utils/secureStorage';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AppNavigator: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const login = (email: string, password: string): void => {
    console.log(' AppNavigator: User logged in successfully!');
    setIsAuthenticated(true);
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('🚪 Starting logout process...');
      SecureStorage.clearUserSession(
        () => {
          console.log(' Logout successful');
          setIsAuthenticated(false);
        },
        (error: any) => {
          console.log(' Logout failed:', error);
          setIsAuthenticated(false);
        }
      );
    } catch (error: any) {
      console.error(' Logout error:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    // Check for existing user session
    SecureStorage.getUserSession(
      (session: any) => {
        if (session && session.token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
        setIsCheckingAuth(false);
      },
      (error: any) => {
        console.log('Error checking session:', error);
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
      }
    );
  }, []);

  if (showSplash || isCheckingAuth) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      <NavigationContainer>
        {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};
