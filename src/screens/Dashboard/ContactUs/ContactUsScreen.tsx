import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { BackHeader } from '../../../components/BackHeader/BackHeader';
import { BottomNavigation } from '../../../components/BottomMenu/BottomMenu';
import { TelegramModal } from '../../../components/Modal/TelegramModal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SecureStorage from '../../../utils/secureStorage';
import { useNotification } from '../../../components/Notification/NotificationManager';
import { sendContactMessageToTelegram } from '../../../services/telegramService';
import { styles } from './styles';

export const ContactUsScreen: React.FC = () => {
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [message, setMessage] = useState('');
  const [agentName, setAgentName] = useState('Agent');
  const [agentMobile, setAgentMobile] = useState('');
  const { showNotification } = useNotification();

  useEffect(() => {
    SecureStorage.getUserSession(
      (session: any) => {
        if (session?.user) {
          console.log('User session:', session.user)
          setAgentName(session.user.name || 'Agent');
          setAgentMobile(session.user.mobile_number || '');
        }
      },
      (error: any) => {
        console.log('Error getting user session:', error);
      }
    );
  }, []);
  const contactMethods = [
    {
      type: 'Phone',
      value: '+91 98348 28054',
      icon: 'phone',
      action: () => Linking.openURL('tel:+919834828054')
    },
    {
      type: 'WhatsApp',
      value: '+91 98348 28054',
      icon: 'chat',
      action: () => Linking.openURL('https://wa.me/919834828054')
    },
    {
      type: 'Email',
      value: 'support@saudagar.com',
      icon: 'email',
      action: () => Linking.openURL('mailto:supportsaudagar@gmail.com')
    },
    {
      type: 'Telegram',
      value: '@SaudagarSupport',
      icon: 'send',
      action: () => setShowTelegramModal(true)
    }
  ];

  const handleSendTelegramMessage = async () => {
    if (!message.trim()) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Please enter a message',
      });
      return;
    }

    const messageData = {
      agentName,
      agentMobile,
      message: message.trim()
    };
    
    const result = await sendContactMessageToTelegram(messageData, showNotification);
    
    if (result.success) {
      setShowTelegramModal(false);
      setMessage('');
    }
  };

  const supportHours = [
    { day: 'Monday - Saturaday', time: '6:00 AM - 12:00 PM' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader 
        title="Contact Us"
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.subtitle}>Get in touch with our support team</Text>

        <View style={styles.contactContainer}>
          {contactMethods.map((method, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.contactCard}
              onPress={method.action}
            >
              <View style={styles.contactIcon}>
                <Icon name={method.icon} size={24} color="#FFFFFF" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactType}>{method.type}</Text>
                <Text style={styles.contactValue}>{method.value}</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.hoursContainer}>
          <Text style={styles.hoursTitle}>Support Hours</Text>
          {supportHours.map((hour, index) => (
            <View key={index} style={styles.hourRow}>
              <Text style={styles.dayText}>{hour.day}</Text>
              <Text style={styles.timeText}>{hour.time}</Text>
            </View>
          ))}
        </View>

        <View style={styles.noteContainer}>
          <Icon name="info" size={20} color="#3B82F6" />
          <Text style={styles.noteText}>
            For urgent issues, please call our support number. 
            We typically respond to emails within 15 minutes.
          </Text>
        </View>
      </ScrollView>

      <TelegramModal
        visible={showTelegramModal}
        onClose={() => setShowTelegramModal(false)}
        agentName={agentName}
        agentMobile={agentMobile}
        message={message}
        onMessageChange={setMessage}
        onSend={handleSendTelegramMessage}
      />

      <BottomNavigation activeTab="Home" />
    </SafeAreaView>
  );
};
