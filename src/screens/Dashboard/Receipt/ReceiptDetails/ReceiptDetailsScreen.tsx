import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
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
  const [isPrinting, setIsPrinting] = useState(false);
  const { receiptData, receiptNo } = route.params as {
    receiptData: any;
    receiptNo: string;
  };

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const permissions = [];
        
        // Check Android version and request appropriate permissions
        if (Platform.Version >= 31) {
          // Android 12+ permissions
          permissions.push(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
          );
        } else {
          // Android 11 and below permissions
          permissions.push(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
        }

        const granted = await PermissionsAndroid.requestMultiple(permissions);
        
        // Check if all permissions are granted
        const allPermissionsGranted = permissions.every(
          permission => granted[permission] === PermissionsAndroid.RESULTS.GRANTED
        );
        
        return allPermissionsGranted;
      } catch (error) {
        console.error('Permission request error:', error);
        return false;
      }
    }
    return true; // iOS doesn't need explicit Bluetooth permissions for printing
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    
    try {
      // Request Bluetooth permissions first
      const hasPermissions = await requestBluetoothPermissions();
      
      if (!hasPermissions) {
        showNotification({
          type: 'error',
          title: 'Permissions Required',
          message: 'Bluetooth permissions are required for printing. Please enable them in app settings.',
        });
        setIsPrinting(false);
        return;
      }
      
      const { NativeModules } = require('react-native');
      const { PrinterModule } = NativeModules;
      
      const gameName = receiptData.bids?.[0]?.game_name || 'Game';
      const gameInitials = gameName.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
      const session = receiptData.receipt_info?.session || 'Open';
      const sessionCode = session.toLowerCase() === 'open' ? 'OP' : 'CL';
      const receiptDate = receiptData.receipt_info?.receipt_date ? new Date(receiptData.receipt_info.receipt_date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
      console.log("Bid Details : ",receiptData.bids);
      const receiptText = 'SAU-' + gameInitials + '\n' +
        'Receipt: ' + (receiptData.receipt_info?.receipt_no || receiptNo) + '\n' +
        'Date: ' + receiptDate + ' - ' + sessionCode + '\n' +
        '--------------------------------\n' +
        'BID DETAILS:\n' +
        receiptData.bids?.map(bid => {
          const bidTypeInitials = bid.bid_type_name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
          return bidTypeInitials + ' - ' + bid.bid_number + ' - Rs' + bid.amount;
        }).join('\n') + '\n' +
        '--------------------------------\n' +
        'TOTAL: Rs' + (receiptData.receipt_info?.total_amount || 0) + '\n' +
        '--------------------------------\n' +
        '* Receipt generated upon request\n\n\n\n';

      await PrinterModule.printReceipt(receiptText);
      
      showNotification({
        type: 'success',
        title: 'Print Successful',
        message: 'Receipt printed successfully!',
      });
    } catch (error) {
      console.error('Print error:', error);
      
      let errorMessage = 'Please check printer connection and try again.';
      
      if (error.code === 'NO_PERMISSION') {
        errorMessage = 'Bluetooth permissions required. Please enable all Bluetooth permissions in Settings > Apps > Saudagar > Permissions.';
      } else if (error.code === 'BLUETOOTH_DISABLED') {
        errorMessage = 'Please enable Bluetooth and try again.';
      } else if (error.code === 'NO_PRINTER') {
        errorMessage = 'No printer found. Please pair your thermal printer in Bluetooth settings first.';
      } else if (error.code === 'CONNECTION_ERROR') {
        errorMessage = 'Connection failed. Please ensure printer is on and nearby, then try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification({
        type: 'error',
        title: 'Print Failed',
        message: errorMessage,
      });
    } finally {
      setIsPrinting(false);
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
          <TouchableOpacity 
            style={[styles.printBtn, isPrinting && styles.printBtnDisabled]} 
            onPress={handlePrint}
            disabled={isPrinting}
          >
            {isPrinting ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <Icon name="print" size={24} color="#EF4444" />
            )}
            <Text style={styles.printBtnText}>
              {isPrinting ? 'Printing...' : 'Print Receipt'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
