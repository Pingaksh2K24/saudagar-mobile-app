import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

type DialogType = 'warning' | 'error' | 'success' | 'info';

interface DialogBoxProps {
  visible: boolean;
  type: DialogType;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

export const DialogBox: React.FC<DialogBoxProps> = ({
  visible,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'warning':
        return {
          icon: 'warning',
          color: '#F59E0B',
          backgroundColor: '#FEF3C7',
        };
      case 'error':
        return {
          icon: 'error',
          color: '#EF4444',
          backgroundColor: '#FEE2E2',
        };
      case 'success':
        return {
          icon: 'check-circle',
          color: '#10B981',
          backgroundColor: '#D1FAE5',
        };
      case 'info':
        return {
          icon: 'info',
          color: '#3B82F6',
          backgroundColor: '#DBEAFE',
        };
      default:
        return {
          icon: 'info',
          color: '#6B7280',
          backgroundColor: '#F3F4F6',
        };
    }
  };

  const config = getTypeConfig();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: config.backgroundColor },
            ]}
          >
            <Icon name={config.icon} size={18} color={config.color} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.confirmButton,
                { backgroundColor: config.color },
                !showCancel && styles.singleButton,
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
