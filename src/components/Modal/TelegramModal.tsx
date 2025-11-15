import React from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TelegramModalProps } from '../../utils/types';
import { styles } from './styles';

export const TelegramModal: React.FC<TelegramModalProps> = ({
  visible,
  onClose,
  agentName,
  agentMobile,
  message,
  onMessageChange,
  onSend,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.telegramModal}>
          <View style={styles.modalHeader}>
            <Icon name="send" size={24} color="#0088cc" />
            <Text style={styles.modalTitle}>Send Message to Telegram</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.agentInfo}>
            <Text style={styles.agentLabel}>Agent Name:</Text>
            <Text style={styles.agentValue}>{agentName}</Text>
          </View>
          
          <View style={styles.agentInfo}>
            <Text style={styles.agentLabel}>Mobile:</Text>
            <Text style={styles.agentValue}>{agentMobile}</Text>
          </View>
          
          <View style={styles.messageContainer}>
            <Text style={styles.messageLabel}>Message:</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message here..."
              placeholderTextColor="#999"
              value={message}
              onChangeText={onMessageChange}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <TouchableOpacity style={styles.sendButton} onPress={onSend}>
            <Icon name="send" size={20} color="#fff" />
            <Text style={styles.sendButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};