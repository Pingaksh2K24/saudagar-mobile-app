import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BackHeader } from '../../../../components/BackHeader/BackHeader';
import { sendReceiptToTelegram } from '../../../../services/telegramService';
import DashboardServices from '../../../../services/axiosServices/apiServices/DashboardServices';
import { useNotification } from '../../../../components/Notification/NotificationManager';
import { styles } from './styles';

export const BidReceiptScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { showNotification } = useNotification();
  const {
    gameName,
    bids,
    totalAmount,
    userName = 'John Doe',
    selectedSession = 'Open',
    gameParams,
    userId,
  } = route.params as {
    gameName: string;
    bids: any[];
    totalAmount: number;
    userName?: string;
    selectedSession?: string;
    gameParams?: any;
    userId?: string;
  };

  const currentDate = new Date();

  // Get user initials safely
  const getUserInitials = (name: string) => {
    if (!name || name === 'Loading...') return 'XX';

    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (parts[0][0] + (parts[0][1] || 'X')).toUpperCase();
  };
  // Format: RCP-JD123-251107-3459 (initials + userId)
  const year = currentDate.getFullYear().toString().slice(-2);
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const initials = getUserInitials(userName);
  const timestamp = Date.now().toString().slice(-4);

  const receiptId = `RCP-${initials}${userId || ''}-${year}${month}${day}-${timestamp}`;

  const handlePrint = () => {
    // Submit bids to API
    const dashboardServices = new DashboardServices();
    const request = {
      receipt: {
        receipt_id: receiptId,
        agent_id: userId,
        total_amount: totalAmount,
        total_bids: bids.length,
        session: selectedSession.toLowerCase(),
        receipt_date: currentDate.toISOString().split('T')[0],
      },
      bids: bids,
    };

    console.log('Print - Full request: ', JSON.stringify(request, null, 2));
    dashboardServices
      .bidPlace(request)
      .then((response: any) => {
        console.log("Bid Placement API response :", response);
        if (response) {
          // Send receipt to Telegram in background
          const receiptData = {
            receiptId,
            userName,
            gameName,
            totalAmount,
            bids,
            selectedSession,
            date:
              currentDate.toLocaleDateString() +
              ' ' +
              currentDate.toLocaleTimeString(),
          };
          sendReceiptToTelegram(receiptData, showNotification);
          showNotification({
            type: 'success',
            title: 'Print Receipt',
            message: 'Bid placed and receipt sent to printer successfully!',
          });
          (navigation as any).navigate('BidPlacement', { ...gameParams, resetBids: true });
        } else {
          showNotification({
            type: 'error',
            title: 'Error',
            message: 'Failed to place bid. Please try again.',
          });
        }
      })
      .catch((error: any) => {
        showNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to place bid. Please try again.',
        });
      });
  };

  const handleDone = () => {
    // Submit bids to API
    const dashboardServices = new DashboardServices();
    const request = {
      receipt: {
        receipt_id: receiptId,
        agent_id: userId,
        total_amount: totalAmount,
        total_bids: bids.length,
        session: selectedSession.toLowerCase(),
        receipt_date: currentDate.toISOString().split('T')[0],
      },
      bids: bids,
    };
    console.log("Bid Placement API Bids Request :", bids);
    console.log("First bid game_result_id:", bids[0]?.game_result_id);
    console.log("GameParams:", gameParams);
    dashboardServices
      .bidPlace(request)
      .then((response: any) => {
         console.log("Bid Placement API response :", response);
        if (response) {
          // Send receipt to Telegram in background
          const receiptData = {
            receiptId,
            userName,
            gameName,
            totalAmount,
            bids,
            selectedSession,
            date:
              currentDate.toLocaleDateString() +
              ' ' +
              currentDate.toLocaleTimeString(),
          };

          sendReceiptToTelegram(receiptData, showNotification);
          (navigation as any).navigate('BidPlacement', { ...gameParams, resetBids: true });
          showNotification({
            type: 'success',
            title: 'Bid Placed',
            message: 'Bid placed!',
          });
        } else {
          showNotification({
            type: 'error',
            title: 'Error',
            message: 'Failed to place bid. Please try again.',
          });
        }
      })
      .catch((error: any) => {
        console.error('Bid placement error:', error);
        showNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to place bid. Please try again.',
        });
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader 
        title="Receipt" 
        onBackPress={() => (navigation as any).navigate('BidPlacement', gameParams)}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <Image
              source={require('../../../../assets/images/saudagar-circle-icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.rightHeader}>
              <Text style={styles.receiptTitle}>Receipt</Text>
              <Text style={styles.gameName}>{gameName}</Text>
              <Text style={styles.receiptId}>#{receiptId}</Text>
            </View>
          </View>

          <View style={styles.headerInfo}>
            <View style={styles.leftInfo}>
              <Text style={styles.agentLabel}>Agent Name</Text>
              <Text style={styles.agentName}>{userName}</Text>
            </View>
            <View style={styles.rightInfo}>
              <Text style={styles.dateTime}>
                {currentDate.toLocaleDateString()}
              </Text>
              <Text style={styles.dateTime}>
                {currentDate.toLocaleTimeString()}
              </Text>
            </View>
          </View>

          <Text style={styles.bidFor}>Bid for {selectedSession}</Text>

          <View style={styles.bidDetailsSection}>
            <Text style={styles.bidDetailsTitle}>Bid Details</Text>

            <View style={styles.tableHeader}>
              <Text style={styles.headerCol1}>No.</Text>
              <Text style={styles.headerCol2}>Type</Text>
              <Text style={styles.headerCol3}>Number</Text>
              <Text style={styles.headerCol4}>Amount</Text>
            </View>

            {bids.map((bid, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.col1}>#{index + 1}</Text>
                <Text style={styles.col2}>{bid.bid_name}</Text>
                <Text style={styles.col3}>{bid.bid_number}</Text>
                <Text style={styles.col4}>₹{bid.amount}</Text>
              </View>
            ))}
          </View>

          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Bid Amount:</Text>
              <Text style={styles.totalAmount}>₹{totalAmount}</Text>
            </View>
          </View>

          <View style={styles.dividerLine} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.printBtn} onPress={handlePrint}>
            <Icon name="print" size={18} color="#EF4444" />
            <Text style={styles.printBtnText}>Print Receipt</Text>
          </TouchableOpacity>

          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            style={styles.doneBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity style={styles.doneBtnInner} onPress={handleDone}>
              <Icon name="check-circle" size={18} color="#fff" />
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
