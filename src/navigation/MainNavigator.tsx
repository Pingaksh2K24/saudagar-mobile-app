import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/Dashboard/Home/HomeScreen';
import { BidHistoryScreen } from '../screens/Dashboard/Bid/BidHistory/BidHistoryScreen';
import { ContactUsScreen } from '../screens/Dashboard/ContactUs/ContactUsScreen';
import { ProfileScreen } from '../screens/Dashboard/Profile/ProfileScreen';
import { BidPlacementScreen } from '../screens/Dashboard/Bid/BidPlacement/BidPlacementScreen';
import { BidReceiptScreen } from '../screens/Dashboard/Bid/BidReceipt/BidReceiptScreen';
import { ReceiptScreen } from '../screens/Dashboard/Receipt/ReceiptScreen/ReceiptScreen';
import { ReceiptDetailsScreen } from '../screens/Dashboard/Receipt/ReceiptDetails/ReceiptDetailsScreen';
import { PrintTestScreen } from '../screens/Dashboard/PrintTest/PrintTestScreen';

const Stack = createStackNavigator();

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="BidHistory" component={BidHistoryScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="BidPlacement" component={BidPlacementScreen} />
      <Stack.Screen name="BidReceipt" component={BidReceiptScreen} />
      <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} />
      <Stack.Screen name="ReceiptDetails" component={ReceiptDetailsScreen} />
      <Stack.Screen name="PrintTest" component={PrintTestScreen} />
    </Stack.Navigator>
  );
};