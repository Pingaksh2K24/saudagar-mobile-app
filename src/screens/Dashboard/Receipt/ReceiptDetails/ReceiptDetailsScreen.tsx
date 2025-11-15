import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BackHeader } from '../../../../components/BackHeader/BackHeader';

import { useNotification } from '../../../../components/Notification/NotificationManager';

import { styles } from './styles';

export const ReceiptDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { showNotification } = useNotification();
  const { receiptData, receiptNo } = route.params as {
    receiptData: any;
    receiptNo: string;
  };

  const handlePrint = async () => {
    try {
      const receiptText = `
${receiptData.bids?.[0]?.game_name || 'Game'}
Receipt #${receiptData.receipt_info?.receipt_no || receiptNo}
--------------------------------
Agent: ${receiptData.receipt_info?.agent_name || 'Agent'}
Date: ${receiptData.receipt_info?.receipt_date ? new Date(receiptData.receipt_info.receipt_date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}
Session: ${receiptData.receipt_info?.session || 'Open'}
--------------------------------
BID DETAILS:
${receiptData.bids?.map((bid: any, index: number) => `${index + 1}. ${bid.bid_type_name} - ${bid.bid_number} - ₹${bid.amount}`).join('\n')}
--------------------------------
TOTAL: ₹${receiptData.receipt_info?.total_amount || 0}
--------------------------------
* Receipt generated upon request


`;

      // Print functionality will be implemented later
      console.log('Receipt to print:', receiptText);
      
      showNotification({
        type: 'success',
        title: 'Print Successful',
        message: 'Receipt printed successfully!',
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Print Failed',
        message: 'Please check printer connection and try again.',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader 
        title="Receipt Details" 
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <Image
              source={require('../../../../assets/images/saudagar-circle-icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.gameName}>
                {receiptData.bids?.[0]?.game_name || 'Game'}
              </Text>
              <Text style={styles.receiptId}>
                #{receiptData.receipt_info?.receipt_no || receiptNo}
              </Text>
            </View>
          </View>

          <View style={styles.headerInfo}>
            <View style={styles.leftInfo}>
              <Text style={styles.agentLabel}>Agent Name</Text>
              <Text style={styles.agentName}>
                {receiptData.receipt_info?.agent_name || 'Agent'}
              </Text>
            </View>
            <View style={styles.rightInfo}>
              <Text style={styles.dateTime}>
                {receiptData.receipt_info?.receipt_date
                  ? new Date(
                      receiptData.receipt_info.receipt_date
                    ).toLocaleDateString('en-GB')
                  : new Date().toLocaleDateString('en-GB')}
              </Text>
            </View>
          </View>

          <Text style={styles.bidFor}>
            Bid for {receiptData.receipt_info?.session || 'Open'}
          </Text>

          <View style={styles.bidDetailsSection}>
            <Text style={styles.bidDetailsTitle}>Bid Details</Text>

            <View style={styles.tableHeader}>
              <Text style={styles.headerCol1}>No.</Text>
              <Text style={styles.headerCol2}>Type</Text>
              <Text style={styles.headerCol3}>Number</Text>
              <Text style={styles.headerCol4}>Amount</Text>
            </View>

            {receiptData.bids?.map((bid: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.col1}>#{index + 1}</Text>
                <Text style={styles.col2}>{bid.bid_type_name}</Text>
                <Text style={styles.col3}>{bid.bid_number}</Text>
                <Text style={styles.col4}>₹{bid.amount}</Text>
              </View>
            ))}
          </View>

          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Bid Amount:</Text>
              <Text style={styles.totalAmount}>
                ₹{receiptData.receipt_info?.total_amount || 0}
              </Text>
            </View>
          </View>

          <View style={styles.dividerLine} />

          <Text style={styles.instructionText}>
            * Receipt will be generated upon request
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.printBtn} onPress={handlePrint}>
            <Icon name="print" size={24} color="#EF4444" />
            <Text style={styles.printBtnText}>Print Receipt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
