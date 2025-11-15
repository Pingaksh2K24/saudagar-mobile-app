import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BottomNavigationProps } from '../../utils/types';
import { styles } from './styles';

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeTab = 'Home',
  onTabPress 
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const navItems = [
    { id: 'Home', icon: 'home', label: 'Home', screen: 'Home' },
    { id: 'Bidding', icon: 'list', label: 'Bid History', screen: 'BidHistory' },
    { id: 'Receipt', icon: 'receipt', label: 'Receipt', screen: 'ReceiptScreen' },
    { id: 'Profile', icon: 'person', label: 'Profile', screen: 'ProfileScreen' },
  ];

  const handleTabPress = (item: any) => {
    if (onTabPress) {
      onTabPress(item.id);
    } else {
      navigation.navigate(item.screen as never);
    }
  };

  return (
    <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {navItems.map((item) => (
        <TouchableOpacity 
          key={item.id}
          style={[
            styles.navItem,
            activeTab === item.id && styles.activeNavItem
          ]}
          onPress={() => handleTabPress(item)}
        >
          <View style={[
            styles.iconContainer,
            activeTab === item.id && styles.activeIconContainer
          ]}>
            <Icon 
              name={item.icon}
              size={32}
              color={activeTab === item.id ? '#FFFFFF' : '#6B7280'}
            />
          </View>
          <Text style={[
            styles.navLabel,
            activeTab === item.id && styles.activeNavLabel
          ]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

