import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from '../constants/colors';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = {
    colors: isDark ? colors.dark : colors,
    isDark,
  };

  return {
    theme,
    isDark,
    toggleTheme,
  };
};