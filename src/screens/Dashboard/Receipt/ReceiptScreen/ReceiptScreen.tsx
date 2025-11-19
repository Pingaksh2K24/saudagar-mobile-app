import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { BackHeader } from '../../../../components/BackHeader/BackHeader';
import { BottomNavigation } from '../../../../components/BottomMenu/BottomMenu';
import { Loader } from '../../../../components/Loader/Loader';
import DashboardServices from '../../../../services/axiosServices/apiServices/DashboardServices';
import SecureStorage from '../../../../utils/secureStorage';
import { useNotification } from '../../../../components/Notification/NotificationManager';
import { styles } from './styles';

export const ReceiptScreen: React.FC = () => {
  const navigation = useNavigation();
  const { showNotification } = useNotification();
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const dashboardServices = new DashboardServices();

  useEffect(() => {
    // Get user ID and fetch receipts
    SecureStorage.getUserSession(
      (session: any) => {
        if (session?.user?.id) {
          setUserId(session.user.id);
          fetchReceipts(session.user.id);
        }
      },
      (error: any) => {
        console.log('Error getting user session:', error);
        setLoading(false);
      }
    );
  }, []);

  const fetchReceipts = (agentId: string) => {
    console.log('Agent Is is :', agentId);
    dashboardServices
      .getReceiptsByAgent(agentId)
      .then((response: any) => {
        console.log('Receipts Response:', response);
        if (
          response &&
          response?.statusCode === 200 &&
          response?.success === true
        ) {
          setReceipts(response.data.receipts);
        }
        setLoading(false);
      })
      .catch((error: any) => {
        console.error('Error fetching receipts:', error);
        setLoading(false);
      });
  };

  const handlePrintReceipt = (receiptNo: string) => {
    dashboardServices
      .getReceiptDetails(receiptNo)
      .then((response: any) => {
        console.log("MyScreen :",response);
        if (
          response &&
          response?.statusCode === 200 &&
          response?.success === true
        ) {
          const receiptData = response.data;
          (navigation as any).navigate('ReceiptDetails', {
            receiptData: receiptData,
            receiptNo: receiptNo,
          });
        } else {
          showNotification({
            type: 'error',
            title: 'Error',
            message: 'Failed to fetch receipt details',
          });
        }
      })
      .catch((error: any) => {
        console.error('Error fetching receipt details:', error);
        showNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch receipt details',
        });
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Receipt" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <Loader color="#6B7280" />
        ) : receipts?.length > 0 ? (
          receipts?.map((receipt, index) => (
            <LinearGradient
              key={index}
              colors={['#0F243D', '#0F243D', '#0F243D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.receiptCard}
            >
              <View style={styles.receiptHeader}>
                <Text style={styles.receiptTitle}>Receipt Details</Text>
                <Text style={styles.receiptId}>#{receipt.receipt_no}</Text>
              </View>

              <View style={styles.receiptBody}>
                <View style={styles.doubleRow}>
                  <View style={styles.halfRow}>
                    <Text style={styles.label}>Amount:</Text>
                    <Text style={styles.amountValue}>₹{receipt.total_amount}</Text>
                  </View>
                  
                  <View style={styles.halfRow}>
                    <Text style={styles.label}>Bids:</Text>
                    <Text style={styles.value}>{receipt.total_bids}</Text>
                  </View>
                </View>

                <View style={styles.doubleRow}>
                  <View style={styles.halfRow}>
                    <Text style={styles.label}>Session:</Text>
                    <Text style={styles.value}>{receipt.session}</Text>
                  </View>
                  
                  <View style={styles.halfRow}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>{new Date(receipt.receipt_date).toLocaleDateString('en-GB')}</Text>
                  </View>
                </View>
                
                <View style={styles.printButtonContainer}>
                  <TouchableOpacity 
                    style={styles.printButton}
                    onPress={() => handlePrintReceipt(receipt.id)}
                  >
                    <Icon name="print" size={16} color="#EF4444" />
                    <Text style={styles.printButtonText}>Print</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          ))
        ) : (
          <Text style={styles.noDataText}>No receipts found</Text>
        )}
      </ScrollView>
      <BottomNavigation activeTab="Receipt" />
    </SafeAreaView>
  );
};
