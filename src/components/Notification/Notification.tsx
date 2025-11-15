import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NotificationType } from './NotificationManager';

const { width } = Dimensions.get('window');

interface NotificationProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  onClose
}) => {
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'check-circle',
          color: '#FFFFFF',
          backgroundColor: 'linear-gradient(135deg, #10B981, #059669)',
          solidColor: '#10B981',
          borderColor: '#10B981'
        };
      case 'error':
        return {
          icon: 'error',
          color: '#FFFFFF',
          backgroundColor: 'linear-gradient(135deg, #EF4444, #DC2626)',
          solidColor: '#EF4444',
          borderColor: '#EF4444'
        };
      case 'warning':
        return {
          icon: 'warning',
          color: '#FFFFFF',
          backgroundColor: 'linear-gradient(135deg, #F59E0B, #D97706)',
          solidColor: '#F59E0B',
          borderColor: '#F59E0B'
        };
      case 'info':
        return {
          icon: 'info',
          color: '#FFFFFF',
          backgroundColor: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          solidColor: '#3B82F6',
          borderColor: '#3B82F6'
        };
      default:
        return {
          icon: 'info',
          color: '#FFFFFF',
          backgroundColor: '#6B7280',
          solidColor: '#6B7280',
          borderColor: '#6B7280'
        };
    }
  };

  const config = getTypeConfig();

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.solidColor,
          borderLeftColor: config.borderColor,
          transform: [{ translateX: slideAnim }],
          opacity: opacityAnim,
        }
      ]}
    >
      <View style={styles.content}>
        <View style={styles.icon}>
          <Icon name={config.icon} size={26} color={config.color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: '#FFFFFF' }]}>{title}</Text>
          <Text style={[styles.message, { color: 'rgba(255, 255, 255, 0.9)' }]}>{message}</Text>
        </View>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Icon name="close" size={18} color="rgba(255, 255, 255, 0.8)" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    borderRadius: 16,
    borderLeftWidth: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
    zIndex: 9999,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingVertical: 10,
  },
  icon: {
    marginRight: 12,
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  message: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 18,
    fontWeight: '500',
  },
  closeButton: {
    padding: 6,
    marginLeft: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});