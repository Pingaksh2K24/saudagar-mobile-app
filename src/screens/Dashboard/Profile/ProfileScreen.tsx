import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { BackHeader } from '../../../components/BackHeader/BackHeader';
import { BottomNavigation } from '../../../components/BottomMenu/BottomMenu';
import { DialogBox } from '../../../components/DialogBox';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SecureStorage from '../../../utils/secureStorage';
import { useAuth } from '../../../navigation/AppNavigator';
import { useNotification } from '../../../components/Notification/NotificationManager';
import { styles } from './styles';

export const ProfileScreen: React.FC = () => {
  const { logout } = useAuth();
  const { showNotification } = useNotification();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: 'Loading...',
    email: 'Loading...',
  });

  useEffect(() => {
    SecureStorage.getUserSession(
      (session: any) => {
        if (session?.user) {
          const userDetails = {
            name: session.user.name || 'User',
            email: session.user.email || 'user@example.com',
          };
          setUserDetails(userDetails);
        } else {
          null;
        }
      },
      (error: any) => {
        null;
      }
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Profile" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../../assets/images/saudagar-circle-icon.png')}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.userName}>{userDetails.name}</Text>
          <Text style={styles.userEmail}>{userDetails.email}</Text>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <Icon name="privacy-tip" size={24} color="#FFFFFF" />
            <Text style={styles.optionText}>Privacy Policy</Text>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionItem, styles.logoutOption]}
            onPress={() => setShowLogoutDialog(true)}
          >
            <Icon name="logout" size={24} color="#EF4444" />
            <Text style={[styles.optionText, styles.logoutText]}>Logout</Text>
            <Icon name="chevron-right" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigation activeTab="Profile" />

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
          showNotification({
            type: 'success',
            title: 'Logged Out',
            message: 'Logged out successfully',
          });
          logout();
        }}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </SafeAreaView>
  );
};
