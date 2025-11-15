import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { BackHeaderProps } from '../../utils/types';
import { styles } from './styles';

export const BackHeader: React.FC<BackHeaderProps> = ({
  title,
  onBackPress,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress || (() => navigation.navigate('Home' as never))}
      >
        <Icon name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
};
