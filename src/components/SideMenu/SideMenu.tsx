import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../navigation/AppNavigator';
import SecureStorage from '../../utils/secureStorage';
import { useNotification } from '../Notification/NotificationManager';
import { DialogBox } from '../DialogBox';
import { styles } from './styles';

interface SideMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isVisible, onClose }) => {
  const [userDetails, setUserDetails] = useState({
    name: 'Loading...',
    email: 'Loading...',
  });
  const navigation = useNavigation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { logout } = useAuth();
  const { showNotification } = useNotification();
  const slideAnim = useRef(new Animated.Value(-250)).current;

  useEffect(() => {
    SecureStorage.getUserSession(
      (session: any) => {
        if (session?.user) {
          setUserDetails({
            name: session.user.name || 'User',
            email: session.user.email || 'user@example.com',
          });
        }
      },
      (error: any) => {
        console.log('Error getting user session:', error);
      }
    );
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Change status bar immediately when opening
      StatusBar.setBarStyle('light-content', true);
      StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.6)', true);
      
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        // Reset status bar after animation completes
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor('#DC2626', true);
      });
    }
  }, [isVisible, slideAnim]);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const handleMenuItemPress = (item: any) => {
    switch (item.title) {
      case 'Logout':
        handleLogout();
        break;
      default:
        onClose(); // Close menu first for other items
        switch (item.title) {
          case 'Home':
            navigation.navigate('Home' as never);
            break;
          case 'Profile':
            navigation.navigate('ProfileScreen' as never);
            break;
          case 'Bid History':
            navigation.navigate('BidHistory' as never);
            break;
          case 'Receipt':
            navigation.navigate('ReceiptScreen' as never);
            break;
          case 'Contact Us':
            navigation.navigate('ContactUs' as never);
            break;
          case 'Printer Test':
            navigation.navigate('PrintTest' as never);
            break;
          default:
            console.log('Unknown menu item:', item.title);
        }
    }
  };
  const menuItems = [
    { id: 1, title: 'Home', icon: 'home' },
    { id: 2, title: 'Profile', icon: 'person' },
    { id: 3, title: 'Bid History', icon: 'history' },
    { id: 4, title: 'Receipt', icon: 'receipt' },
    { id: 8, title: 'Contact Us', icon: 'contact-support' },
    { id: 9, title: 'Printer Test', icon: 'print' },
    { id: 10, title: 'Logout', icon: 'logout' },
  ];

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />

      <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
        <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/images/saudagar-circle-icon.png')}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.userName}>{userDetails.name}</Text>
          <Text style={styles.userEmail}>{userDetails.email}</Text>
        </View>

        <ScrollView
          style={styles.menuItems}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.menuItemsContent}
        >
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                item.title === 'Logout' && styles.logoutMenuItem,
              ]}
              onPress={() => handleMenuItemPress(item)}
            >
              <View style={styles.menuItemLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    item.title === 'Logout' && styles.logoutIconContainer,
                  ]}
                >
                  <Icon
                    name={item.icon}
                    size={20}
                    color={item.title === 'Logout' ? '#EF4444' : '#FFFFFF'}
                  />
                </View>
                <Text
                  style={[
                    styles.menuItemText,
                    item.title === 'Logout' && styles.logoutText,
                  ]}
                >
                  {item.title}
                </Text>
              </View>
              <Icon
                name="chevron-right"
                size={20}
                color={item.title === 'Logout' ? '#EF4444' : '#6B7280'}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        </SafeAreaView>
      </Animated.View>
      
      <DialogBox
        visible={showLogoutDialog}
        type="warning"
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        showCancel={true}
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={() => {
          setShowLogoutDialog(false);
          onClose();
          showNotification({
            type: 'success',
            title: 'Logged Out',
            message: 'Logged out successfully'
          });
          logout();
        }}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </View>
  );
};


