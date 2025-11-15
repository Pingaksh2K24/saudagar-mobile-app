import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BackHeader } from '../../../../components/BackHeader/BackHeader';
import { BidTypeModal } from '../../../../components/Modal/BidTypeModal';
import { useRoute, useNavigation } from '@react-navigation/native';
import SecureStorage from '../../../../utils/secureStorage';
import DashboardServices from '../../../../services/axiosServices/apiServices/DashboardServices';
import { useNotification } from '../../../../components/Notification/NotificationManager';
import { BidData } from '../../../../utils/types';
import {
  placeBid as placeBidHelper,
  getBidTypes as getBidTypesHelper,
  addBidRow as addBidRowHelper,
  removeBidRow as removeBidRowHelper,
  updateCurrentBid as updateCurrentBidHelper,
  calculateTotal as calculateTotalHelper,
  getNumberPlaceholder,
} from './bidHelpers';
import { getSinglePannaCombinations, getDoublePannaCombinations, getBiddingCutoffTime } from '../../../../utils/helper';
import { styles } from './styles';

export const BidPlacementScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { showNotification } = useNotification();
  const {
    gameName = 'Game',
    availableSessions = ['Open', 'Close'],
    openTime,
    closeTime,
    resetBids = false,
  } = (route.params as any) || {};

  const [userDetails, setUserDetails] = useState<any>({
    user_id: 'Loading...',
    name: 'Loading...',
  });
  const [bidTypesList, setBidTypesList] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedBidType, setSelectedBidType] = useState(1);
  const [selectedBidName, setSelectedBidName] = useState('Single Digit');
  const [currentBid, setCurrentBid] = useState<BidData>({
    user_id: 0,
    game_id: 0,
    game_result_id: 0,
    bid_type_id: '',
    bid_name: '',
    bid_number: '',
    amount: '',
    session_type: '',
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNumberDropdown, setShowNumberDropdown] = useState(false);
  const [masterPannaData, setMasterPannaData] = useState({
    number: '',
    amount: '',
  });
  const [selectedSession, setSelectedSession] = useState(
    availableSessions[0] || 'Open'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [bidList, setBidList] = useState<BidData[]>([]);
  const numberInputRef = useRef<TextInput>(null);

  // ============================================
  // INITIALIZATION
  // ============================================

  // Initialize dashboard services for API calls
  const dashboardServices = new DashboardServices();

  // Component initialization - fetch bid types on mount
  useEffect(() => {
    getBidTypes();
  }, []);
  // Get user session details on component mount
  useEffect(() => {
    SecureStorage.getUserSession(
      (session: any) => {
        if (session?.user) {
          setUserDetails({
            user_id: session.user.id || null,
            name: session.user.name || 'User',
          });
        }
      },
      (error: any) => {
        console.log('Error getting user session:', error);
      }
    );
  }, []);
  // Reset bids when returning from successful bid placement
  useEffect(() => {
    if (resetBids) {
      setBidList([]);
      setTotalAmount(0);
    }
  }, [resetBids]);

  // Check session timing every minute
  useEffect(() => {
    const checkSessionTiming = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (selectedSession === 'Open' && openTime) {
        const cutoffTime = getBiddingCutoffTime(openTime);
        if (cutoffTime && currentTime >= cutoffTime) {
          showNotification({
            type: 'warning',
            title: 'Bidding Closed',
            message: 'Open session bidding is now closed (10 minutes before open time)',
          });
          navigation.navigate('Home');
        }
      }
      
      if (selectedSession === 'Close' && closeTime) {
        const cutoffTime = getBiddingCutoffTime(closeTime);
        if (cutoffTime && currentTime >= cutoffTime) {
          showNotification({
            type: 'warning',
            title: 'Bidding Closed',
            message: 'Close session bidding is now closed (10 minutes before close time)',
          });
          navigation.navigate('Home');
        }
      }
    };

    const interval = setInterval(checkSessionTiming, 60000); // Check every minute
    checkSessionTiming(); // Check immediately
    
    return () => clearInterval(interval);
  }, [selectedSession, openTime, closeTime]);

  // ============================================
  // HELPER FUNCTION WRAPPERS
  // ============================================

  // Navigate to receipt screen with bid data
  const placeBid = () => {
    placeBidHelper(
      bidList,
      showNotification,
      navigation,
      gameName,
      totalAmount,
      userDetails,
      selectedSession,
      route.params
    );
  };
  // Fetch available bid types from API
  const getBidTypes = () => {
    getBidTypesHelper(dashboardServices, setIsLoading, setBidTypesList);
  };
  // Add current bid to the bid list with validation
  const addBidRow = () => {
    const selectedType = bidTypesList.find(type => type.id === selectedBidType);
    
    // Handle JUG bid type - generate all combinations
    if (selectedType?.bid_code === 'JUG') {
      if (!currentBid.bid_number || !currentBid.amount) {
        showNotification({
          type: 'error',
          title: 'Error',
          message: 'Please enter number and amount',
        });
        return;
      }
      
      const parts = currentBid.bid_number.split('/');
      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        showNotification({
          type: 'error',
          title: 'Error',
          message: 'Please enter valid format (e.g., 2345/6847)',
        });
        return;
      }
      
      const beforeSlash = parts[0];
      const afterSlash = parts[1];
      const newBids: BidData[] = [];
      
      // Generate all combinations
      for (let i = 0; i < beforeSlash.length; i++) {
        for (let j = 0; j < afterSlash.length; j++) {
          const combinationNumber = beforeSlash[i] + afterSlash[j];
          const newBid = {
            ...currentBid,
            user_id: userDetails.user_id,
            game_id: (route.params as any)?.gameId || 0,
            game_result_id: (route.params as any)?.gameResultId || 0,
            bid_type_id: selectedBidType,
            bid_name: selectedBidName,
            session_type: selectedSession,
            bid_number: combinationNumber,
            amount: currentBid.amount,
          };
          newBids.push(newBid);
        }
      }
      
      setBidList([...bidList, ...newBids]);
      setCurrentBid({
        ...currentBid,
        bid_number: '/',
        amount: '',
        bid_type_id: selectedBidType,
      } as BidData);
      calculateTotalHelper([...bidList, ...newBids], setTotalAmount);
      numberInputRef.current?.focus();
      return;
    }
    
    // For SP, DP - check if number came from dropdown (single digit) or manual input
    if (shouldShowNumberDropdown()) {
      const isDropdownSelection = masterPannaData.number && currentBid.bid_number === masterPannaData.number;
      
      if (isDropdownSelection) {
        // Dropdown selection - no validation needed
        if (!currentBid.bid_number || !currentBid.amount) {
          showNotification({
            type: 'error',
            title: 'Error',
            message: 'Please select number and enter amount',
          });
          return;
        }
        
        
        if (selectedType?.bid_code === 'SP') {
          // Generate all SP combinations for selected digit
          const combinations = getSinglePannaCombinations(currentBid.bid_number);
          const newBids: BidData[] = [];
          
          combinations.forEach((combination: string) => {
            const newBid = {
              ...currentBid,
              user_id: userDetails.user_id,
              game_id: (route.params as any)?.gameId || 0,
              game_result_id: (route.params as any)?.gameResultId || 0,
              bid_type_id: selectedBidType,
              bid_name: selectedBidName,
              session_type: selectedSession,
              bid_number: combination,
              amount: currentBid.amount,
            };
            newBids.push(newBid);
          });
          
          setBidList([...bidList, ...newBids]);
          calculateTotalHelper([...bidList, ...newBids], setTotalAmount);
        } else if (selectedType?.bid_code === 'DP') {
          // Generate all DP combinations for selected digit
          const combinations = getDoublePannaCombinations(currentBid.bid_number);
          const newBids: BidData[] = [];
          
          combinations.forEach((combination: string) => {
            const newBid = {
              ...currentBid,
              user_id: userDetails.user_id,
              game_id: (route.params as any)?.gameId || 0,
              game_result_id: (route.params as any)?.gameResultId || 0,
              bid_type_id: selectedBidType,
              bid_name: selectedBidName,
              session_type: selectedSession,
              bid_number: combination,
              amount: currentBid.amount,
            };
            newBids.push(newBid);
          });
          
          setBidList([...bidList, ...newBids]);
          calculateTotalHelper([...bidList, ...newBids], setTotalAmount);
        }
        
        setCurrentBid({
          ...currentBid,
          bid_number: '',
          amount: '',
          bid_type_id: selectedBidType,
        } as BidData);
        setMasterPannaData({ number: '', amount: '' });
        numberInputRef.current?.focus();
      } else {
        // Manual input - use normal validation for 3 digits
        addBidRowHelper(
          currentBid,
          bidList,
          selectedBidType,
          selectedBidName,
          selectedSession,
          userDetails,
          route.params,
          bidTypesList,
          showNotification,
          setBidList,
          setCurrentBid,
          (bids: BidData[]) => calculateTotalHelper(bids, setTotalAmount),
          numberInputRef
        );
      }
    } else {
      // For other bid types - use normal validation
      addBidRowHelper(
        currentBid,
        bidList,
        selectedBidType,
        selectedBidName,
        selectedSession,
        userDetails,
        route.params,
        bidTypesList,
        showNotification,
        setBidList,
        setCurrentBid,
        (bids: BidData[]) => calculateTotalHelper(bids, setTotalAmount),
        numberInputRef
      );
    }
  };
  // Remove bid from the bid list by index
  const removeBidRow = (index: number) => {
    removeBidRowHelper(index, bidList, setBidList, (bids: BidData[]) =>
      calculateTotalHelper(bids, setTotalAmount)
    );
  };
  // Update current bid input with validation
  const updateCurrentBid = (field: 'bid_number' | 'amount', value: string) => {
    if (field === 'bid_number') {
      const selectedType = bidTypesList.find(type => type.id === selectedBidType);
      
      // For JUG bid type, maintain slash formatting (10 digits / 10 digits)
      if (selectedType?.bid_code === 'JUG') {
        // Handle slash positioning
        const parts = value.split('/');
        
        if (parts.length === 1) {
          // No slash yet, add it after input
          const digits = parts[0].replace(/\D/g, ''); // Only digits
          if (digits.length <= 10) {
            const formatted = digits + '/';
            setCurrentBid({
              ...currentBid,
              bid_number: formatted,
              bid_type_id: selectedBidType,
            });
          }
        } else if (parts.length === 2) {
          // Slash exists, format both parts
          const beforeSlash = parts[0].replace(/\D/g, '').slice(0, 10);
          const afterSlash = parts[1].replace(/\D/g, '').slice(0, 10);
          const formatted = beforeSlash + '/' + afterSlash;
          
          setCurrentBid({
            ...currentBid,
            bid_number: formatted,
            bid_type_id: selectedBidType,
          });
        }
        return;
      }
    }    
    updateCurrentBidHelper(
      field,
      value,
      currentBid,
      selectedBidType,
      bidTypesList,
      setCurrentBid
    );
  };
  // Check if current bid type requires number dropdown (SP, DP)
  const shouldShowNumberDropdown = () => {
    const selectedType = bidTypesList.find(type => type.id === selectedBidType);
    return selectedType?.bid_code === 'SP' || selectedType?.bid_code === 'DP';
  };
  // Handle number selection from dropdown
  const handleNumberSelect = (number: string) => {
    if (shouldShowNumberDropdown()) {
      setMasterPannaData(prev => ({ ...prev, number }));
      updateCurrentBid('bid_number', number);
    }
    setShowNumberDropdown(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title={gameName} />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.bidSection}>
          <View style={styles.sessionContainer}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionLabel}>Session</Text>
              <View style={styles.totalInvestmentSmall}>
                <Text style={styles.totalLabelSmall}>
                  Total: ₹{totalAmount}
                </Text>
              </View>
            </View>
            <View style={styles.radioContainer}>
              {availableSessions.includes('Open') ? (
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setSelectedSession('Open')}
                >
                  <View style={styles.radioCircle}>
                    {selectedSession === 'Open' && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={styles.radioText}>Open</Text>
                </TouchableOpacity>
              ) : (
                <View style={[styles.radioOption, styles.disabledOption]}>
                  <View
                    style={[styles.radioCircle, styles.disabledCircle]}
                  ></View>
                  <Text style={[styles.radioText, styles.disabledText]}>
                    Open (Closed)
                  </Text>
                </View>
              )}

              {availableSessions.includes('Close') ? (
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => {
                    setSelectedSession('Close');
                    // Auto-select SD if JD or JUG is currently selected
                    const currentType = bidTypesList.find(
                      (type) => type.id === selectedBidType
                    );
                    if (
                      currentType?.bid_code === 'JD' ||
                      currentType?.bid_code === 'JUG'
                    ) {
                      const sdType = bidTypesList.find(
                        (type) => type.bid_code === 'SD'
                      );
                      if (sdType) {
                        setSelectedBidType(sdType.id);
                        setSelectedBidName(sdType.display_name);
                      }
                    }
                  }}
                >
                  <View style={styles.radioCircle}>
                    {selectedSession === 'Close' && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={styles.radioText}>Close</Text>
                </TouchableOpacity>
              ) : (
                <View style={[styles.radioOption, styles.disabledOption]}>
                  <View
                    style={[styles.radioCircle, styles.disabledCircle]}
                  ></View>
                  <Text style={[styles.radioText, styles.disabledText]}>
                    Close (Closed)
                  </Text>
                </View>
              )}
            </View>
            {!availableSessions.includes('Open') && (
              <Text style={styles.timeWarning}>
                Open time: {openTime} (Closed 10 min before)
              </Text>
            )}
            {!availableSessions.includes('Close') && (
              <Text style={styles.timeWarning}>
                Close time: {closeTime} (Closed 10 min before)
              </Text>
            )}
          </View>

          <View style={styles.bidTypeContainer}>
            <Text style={styles.bidTypeLabel}>Bid Type</Text>
            <View style={styles.bidTypeButtons}>
              {bidTypesList
                .filter((type: any) => {
                  // Hide JD and JUG when Close session is selected
                  if (
                    selectedSession === 'Close' &&
                    (type.bid_code === 'JD' || type.bid_code === 'JUG')
                  ) {
                    return false;
                  }
                  return true;
                })
                .map((type: any) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.bidTypeButton,
                      selectedBidType === type.id &&
                        styles.selectedBidTypeButton,
                    ]}
                    onPress={() => {
                      setSelectedBidType(type.id);
                      setSelectedBidName(type.display_name);
                      
                      // For JUG bid type, set initial slash
                      if (type.bid_code === 'JUG') {
                        setCurrentBid({
                          ...currentBid,
                          bid_number: '/',
                          bid_type_id: type.id,
                        });
                      } else {
                        setCurrentBid({
                          ...currentBid,
                          bid_number: '',
                          bid_type_id: type.id,
                        });
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.bidTypeButtonText,
                        selectedBidType === type.id &&
                          styles.selectedBidTypeButtonText,
                      ]}
                    >
                      {type.bid_code}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>



          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Enter Bid Details</Text>
            <View style={styles.buttonGroup}>
              {shouldShowNumberDropdown() && (
                <TouchableOpacity
                  style={styles.numberDropdownButton}
                  onPress={() => setShowNumberDropdown(true)}
                >
                  <Text style={styles.numberDropdownButtonText}>
                    {masterPannaData.number || 'Select'}
                  </Text>
                  <Icon name="arrow-drop-down" size={20} color="#fff" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.placeBidBtnSmall}
                onPress={() => {
                  console.log('Place Bid button pressed');
                  placeBid();
                }}
              >
                <Icon name="rocket-launch" size={16} color="#fff" />
                <Text style={styles.placeBidTextSmall}>Place Bid</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bidCard}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Number</Text>
                <TextInput
                  ref={numberInputRef}
                  style={[
                    styles.numberInput,
                    bidTypesList.find(type => type.id === selectedBidType)?.bid_code === 'JUG' && { textAlign: 'center' }
                  ]}
                  placeholder={getNumberPlaceholder(selectedBidType)}
                  placeholderTextColor="#888"
                  value={currentBid.bid_number}
                  onChangeText={(value) =>
                    updateCurrentBid('bid_number', value)
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Amount (₹)</Text>
                <View style={styles.amountInputRow}>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0"
                    placeholderTextColor="#888"
                    value={currentBid.amount}
                    onChangeText={(value) => updateCurrentBid('amount', value)}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.addBtnSmall}
                    onPress={addBidRow}
                  >
                    <Icon name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {bidList.length > 0 && (
            <View style={styles.bidListSection}>
              <Text style={styles.sectionTitle}>Added Bids</Text>
              {bidList.map((bid, index) => (
                <View key={index} style={styles.bidListItem}>
                  <Text style={styles.bidListNumber}>#{index + 1}</Text>
                  <Text style={styles.bidListType}>{bid.bid_name}</Text>
                  <Text style={styles.bidListValue}>{bid.bid_number}</Text>
                  <Text style={styles.bidListAmount}>₹{bid.amount}</Text>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeBidRow(index)}
                  >
                    <Icon name="delete" size={18} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* <BottomNavigation activeTab="Bidding" /> */}

      <BidTypeModal
        visible={showDropdown}
        onClose={() => setShowDropdown(false)}
        bidTypesList={bidTypesList}
        selectedBidType={selectedBidType}
        onSelectBidType={(id, displayName) => {
          setSelectedBidType(id);
          setSelectedBidName(displayName);
        }}
      />

      {/* Number Dropdown Modal */}
      <Modal
        visible={showNumberDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNumberDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setShowNumberDropdown(false)}
          />
          <View style={styles.numberDropdownModal}>
            <Text style={styles.numberDropdownTitle}>Select Number</Text>
            <View style={styles.numberGrid}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <TouchableOpacity
                  key={number}
                  style={styles.numberGridItem}
                  onPress={() => handleNumberSelect(number.toString())}
                >
                  <Text style={styles.numberGridText}>{number}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
