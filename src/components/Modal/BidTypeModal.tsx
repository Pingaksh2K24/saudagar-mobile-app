import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BidType } from '../../utils/types';
import { styles } from './bidTypeModalStyles';

interface BidTypeModalProps {
  visible: boolean;
  onClose: () => void;
  bidTypesList: BidType[];
  selectedBidType: number;
  onSelectBidType: (id: number, displayName: string) => void;
}

export const BidTypeModal: React.FC<BidTypeModalProps> = ({
  visible,
  onClose,
  bidTypesList,
  selectedBidType,
  onSelectBidType,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={onClose}
        />
        <View style={styles.dropdownModal}>
          {bidTypesList?.map((type: any) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.dropdownItem,
                selectedBidType === type.id && styles.selectedDropdownItem,
              ]}
              onPress={() => {
                onSelectBidType(type.id, type.display_name);
                onClose();
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedBidType === type.id &&
                    styles.selectedDropdownItemText,
                ]}
              >
                {type.display_name}
              </Text>
              {selectedBidType === type.id && (
                <Icon name="check" size={20} color="#EF4444" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};