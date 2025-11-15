import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

interface HeaderProps {
  onMenuPress: () => void;
  onNotificationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onMenuPress, 
  onNotificationPress 
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress} activeOpacity={0.7}>
        <Icon name="menu" size={32} color="#FFFFFF" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress} activeOpacity={0.7}>
        <Icon name="notifications" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};