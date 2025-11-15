import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, Animated } from 'react-native';
import { SignInForm } from '../../../components/SignIn/SignInForm';
import AuthenticationServices from '../../../services/axiosServices/apiServices/AuthenticationServices';
import SecureStorage from '../../../utils/secureStorage';
import { useAuth } from '../../../navigation/AppNavigator';
import { useNotification } from '../../../components/Notification/NotificationManager';
import { Platform } from 'react-native';
import { styles } from './styles';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [platform, setPlatform] = useState<string>('android');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const authServices = new AuthenticationServices();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      setPlatform('ios');
    } else if (Platform.OS === 'android') {
      setPlatform('android');
    } else if (Platform.OS === 'web') {
      setPlatform('android');
    }
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim()) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter email address',
      });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter a valid email address',
      });
      return;
    }
    if (!password.trim()) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter password',
      });
      return;
    }
    setIsLoading(true);
    let request = {
      email: email,
      password: password,
      platform: platform,
    };

    authServices
      .userLogin(request)
      .then((response: any) => {
        if (
          response &&
          response.statusCode === 200 &&
          response.success === true
        ) {
          SecureStorage.storeUserSession(response);
          setIsLoading(false);
          setEmail('');
          setPassword('');
          showNotification({
            type: 'success',
            title: 'Login Successful',
            message: 'Welcome back!',
          });
          setTimeout(() => login(email, password), 1000);
        } else if (
          response &&
          response.statusCode === 401 &&
          response.success === false
        ) {
          setIsLoading(false);
          showNotification({
            type: 'error',
            title: 'Login Failed',
            message: 'Invalid credentials',
          });
        } else {
          setIsLoading(false);
          showNotification({
            type: 'error',
            title: 'Login Failed',
            message: response?.message || 'Invalid credentials',
          });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        showNotification({
          type: 'error',
          title: 'Login Failed',
          message: 'Network error. Please try again.',
        });
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <SignInForm
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
          isLoading={isLoading}
        />
      </Animated.View>
    </SafeAreaView>
  );
};
