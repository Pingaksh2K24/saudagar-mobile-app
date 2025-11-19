import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { BackHeader } from '../../../components/BackHeader/BackHeader';
import { BottomNavigation } from '../../../components/BottomMenu/BottomMenu';
import { useNotification } from '../../../components/Notification/NotificationManager';
import { styles } from './styles';

interface BluetoothDevice {
  name: string;
  address: string;
}

export const PrintTestScreen: React.FC = () => {
  const navigation = useNavigation();
  const { showNotification } = useNotification();
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const scanDevices = async () => {
    setIsScanning(true);
    try {
      // For now using mock devices, but you can implement actual Bluetooth scanning
      setTimeout(() => {
        const mockDevices = [
          { name: 'POS-58', address: '00:11:22:33:44:55' },
          { name: 'Thermal Printer', address: '00:11:22:33:44:56' },
          { name: 'POS-80', address: '00:11:22:33:44:57' },
        ];
        setDevices(mockDevices);
        setIsScanning(false);
        
        showNotification({
          type: 'info',
          title: 'Scan Complete',
          message: `Found ${mockDevices.length} devices. Make sure your printer is paired in Bluetooth settings.`,
        });
      }, 2000);
    } catch (error) {
      setIsScanning(false);
      showNotification({
        type: 'error',
        title: 'Scan Failed',
        message: 'Failed to scan for devices. Please check Bluetooth permissions.',
      });
    }
  };

  const connectDevice = async (device: BluetoothDevice) => {
    try {
      setConnectedDevice(device.address);
      showNotification({
        type: 'success',
        title: 'Device Selected',
        message: `Selected ${device.name}. Use 'Print Test' to verify connection.`,
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Selection Failed',
        message: 'Failed to select device',
      });
    }
  };

  const printTest = async () => {
    setIsPrinting(true);
    try {
      const { NativeModules } = require('react-native');
      const { PrinterModule } = NativeModules;
      
      if (!PrinterModule) {
        throw new Error('Printer module not found. Please restart the app.');
      }
      
      const testReceipt = `
        SAUDAGAR
      Print Test Receipt
--------------------------------
Date: ${new Date().toLocaleDateString('en-GB')}
Time: ${new Date().toLocaleTimeString()}
--------------------------------
This is a test print to verify
your thermal printer connection.

If you can see this receipt,
your printer is working correctly.
--------------------------------
        Test Successful!


`;

      const result = await PrinterModule.printReceipt(testReceipt);
      
      showNotification({
        type: 'success',
        title: 'Print Successful',
        message: result || 'Test receipt printed successfully!',
      });
    } catch (error) {
      console.error('Print Error:', error);
      
      let errorMessage = 'Failed to print test receipt';
      
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

  const renderDevice = ({ item }: { item: BluetoothDevice }) => (
    <TouchableOpacity
      style={[
        styles.deviceItem,
        connectedDevice === item.address && styles.connectedDevice
      ]}
      onPress={() => connectDevice(item)}
    >
      <View style={styles.deviceInfo}>
        <Icon name="bluetooth" size={24} color="#EF4444" />
        <View style={styles.deviceDetails}>
          <Text style={styles.deviceName}>{item.name}</Text>
          <Text style={styles.deviceAddress}>{item.address}</Text>
        </View>
      </View>
      {connectedDevice === item.address && (
        <Icon name="check-circle" size={24} color="#10B981" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader 
        title="Print Test" 
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bluetooth Devices</Text>
          
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={scanDevices}
            disabled={isScanning}
          >
            {isScanning ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Icon name="search" size={24} color="#FFFFFF" />
            )}
            <Text style={styles.scanButtonText}>
              {isScanning ? 'Scanning...' : 'Scan Devices'}
            </Text>
          </TouchableOpacity>

          <FlatList
            data={devices}
            renderItem={renderDevice}
            keyExtractor={(item) => item.address}
            style={styles.devicesList}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Print</Text>
          
          <TouchableOpacity 
            style={styles.printButton} 
            onPress={printTest}
            disabled={isPrinting}
          >
            {isPrinting ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <Icon name="print" size={24} color="#EF4444" />
            )}
            <Text style={styles.printButtonText}>
              {isPrinting ? 'Printing...' : 'Print Test'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <BottomNavigation activeTab="Home" />
    </SafeAreaView>
  );
};