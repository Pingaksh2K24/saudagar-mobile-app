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

  const scanDevices = async () => {
    setIsScanning(true);
    try {
      setTimeout(() => {
        const mockDevices = [
          { name: 'POS-58', address: '00:11:22:33:44:55' },
          { name: 'Thermal Printer', address: '00:11:22:33:44:56' },
        ];
        setDevices(mockDevices);
        setIsScanning(false);
      }, 2000);
    } catch (error) {
      setIsScanning(false);
      showNotification({
        type: 'error',
        title: 'Scan Failed',
        message: 'Failed to scan for devices',
      });
    }
  };

  const connectDevice = async (device: BluetoothDevice) => {
    setConnectedDevice(device.address);
    showNotification({
      type: 'success',
      title: 'Connected',
      message: `Connected to ${device.name}`,
    });
  };

  const printTest = async () => {
    try {
      const { NativeModules } = require('react-native');
      const { PrinterModule } = NativeModules;
      
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

      await PrinterModule.printReceipt(testReceipt);
      
      showNotification({
        type: 'success',
        title: 'Print Successful',
        message: 'Test receipt printed successfully!',
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Print Failed',
        message: error.message || 'Failed to print test receipt',
      });
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
          >
            <Icon name="print" size={24} color="#EF4444" />
            <Text style={styles.printButtonText}>Print Test Receipt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};