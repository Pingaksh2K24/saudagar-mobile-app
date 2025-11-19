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
import {
  getSinglePannaCombinations,
  getDoublePannaCombinations,
  getBiddingCutoffTime,
  getPannaType,
  generateJugarCombinations,
  generateMultiplePannaCombinations,
} from '../../../../utils/helper';
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
  const [jugarInput, setJugarInput] = useState('/');
  const [jodiInput, setJodiInput] = useState('');
  const [jodiAmount, setJodiAmount] = useState('');
  const [pannaInput, setPannaInput] = useState('');
  const [pannaAmount, setPannaAmount] = useState('');
  const [jugarAmount, setJugarAmount] = useState('');
  const [selectedSPNumbers, setSelectedSPNumbers] = useState([]);
  const [spAmount, setSpAmount] = useState('');
  const [selectedDPNumbers, setSelectedDPNumbers] = useState([]);
  const [dpAmount, setDpAmount] = useState('');
  const numberInputRef = useRef<TextInput>(null);
  const numberList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

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
            message:
              'Open session bidding is now closed (10 minutes before open time)',
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
            message:
              'Close session bidding is now closed (10 minutes before close time)',
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
    const selectedType = bidTypesList.find(
      (type) => type.id === selectedBidType
    );

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
      const isDropdownSelection =
        masterPannaData.number &&
        currentBid.bid_number === masterPannaData.number;

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
          const combinations = getSinglePannaCombinations(
            currentBid.bid_number
          );
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
          const combinations = getDoublePannaCombinations(
            currentBid.bid_number
          );
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
      const selectedType = bidTypesList.find(
        (type) => type.id === selectedBidType
      );

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
    const selectedType = bidTypesList.find(
      (type) => type.id === selectedBidType
    );
    return selectedType?.bid_code === 'SP' || selectedType?.bid_code === 'DP';
  };
  // Handle number selection from dropdown
  const handleNumberSelect = (number: string) => {
    if (shouldShowNumberDropdown()) {
      setMasterPannaData((prev) => ({ ...prev, number }));
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
        {/* <Text style={styles.sectionTitle}>Enter Bid Details</Text> */}
        <View style={styles.bidSection}>
          {/* TOP ROW */}
          <View style={styles.topRow}>
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
                    Open
                  </Text>
                </View>
              )}

              {availableSessions.includes('Close') ? (
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setSelectedSession('Close')}
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
                    Close
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.placeBidBtnTop}
              onPress={() => {
                placeBid();
              }}
            >
              <Icon name="rocket-launch" size={16} color="#fff" />
              <Text style={styles.placeBidTextTop}>Place Bid</Text>
            </TouchableOpacity>
          </View>

          {/* Single */}
          <View style={styles.inputRow}>
            <Text style={styles.rowTitle}>Single</Text>
            <TextInput
              style={styles.numberInput}
              placeholder="Single Digit"
              placeholderTextColor="#888"
              value={currentBid.bid_number}
              onChangeText={(value) => {
                const numericValue = value.replace(/[^0-9]/g, '');
                if (numericValue.length <= 1) {
                  updateCurrentBid('bid_number', numericValue);
                }
              }}
              keyboardType="numeric"
              maxLength={1}
            />
            <View style={styles.priceBox}>
              <Text style={styles.priceIcon}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Price"
                placeholderTextColor="#888"
                value={currentBid.amount}
                onChangeText={(value) => updateCurrentBid('amount', value)}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity style={styles.addRowBtn} onPress={addBidRow}>
              <Icon name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Jodi */}
          <View style={styles.inputRow}>
            <Text style={styles.rowTitle}>Jodi</Text>
            <TextInput
              style={styles.numberInput}
              placeholder="Jodi Digit"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={jodiInput}
              onChangeText={(value) => {
                const numericValue = value.replace(/[^0-9]/g, '');
                if (numericValue.length <= 2) {
                  setJodiInput(numericValue);
                }
              }}
              maxLength={2}
            />
            <View style={styles.priceBox}>
              <Text style={styles.priceIcon}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Price"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={jodiAmount}
                onChangeText={setJodiAmount}
              />
            </View>
            <TouchableOpacity style={styles.addRowBtn} onPress={() => {
              if (jodiInput && jodiAmount) {
                const jodiType = bidTypesList.find(type => type.bid_code === 'JD');
                const newBid = {
                  user_id: userDetails.user_id,
                  game_id: (route.params as any)?.gameId || 0,
                  game_result_id: (route.params as any)?.gameResultId || 0,
                  bid_type_id: jodiType?.id || selectedBidType,
                  bid_name: jodiType?.display_name || 'Jodi Digit',
                  bid_number: jodiInput,
                  amount: jodiAmount,
                  session_type: selectedSession,
                };
                setBidList([...bidList, newBid]);
                setJodiInput('');
                setJodiAmount('');
                calculateTotalHelper([...bidList, newBid], setTotalAmount);
              }
            }}>
              <Icon name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Jugar */}
          <View style={styles.inputRow}>
            <Text style={styles.rowTitle}>Jugar</Text>
            <TextInput
              style={styles.numberInput}
              placeholder="12/45"
              placeholderTextColor="#888"
              value={jugarInput}
              onChangeText={(value) => {
                // Remove all non-numeric characters except /
                let cleanValue = value.replace(/[^0-9/]/g, '');
                
                // Always maintain slash in center
                const parts = cleanValue.split('/');
                const beforeSlash = (parts[0] || '').slice(0, 10);
                const afterSlash = (parts[1] || '').slice(0, 10);
                
                setJugarInput(beforeSlash + '/' + afterSlash);
              }}
              keyboardType="numeric"
            />
            <View style={styles.priceBox}>
              <Text style={styles.priceIcon}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Price"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={jugarAmount}
                onChangeText={setJugarAmount}
              />
            </View>
            <TouchableOpacity style={styles.addRowBtn} onPress={() => {
              if (jugarInput && jugarAmount && jugarInput.includes('/')) {
                const jugType = bidTypesList.find(type => type.bid_code === 'JUG');
                const combinations = generateJugarCombinations(jugarInput);
                const newBids = [];
                
                combinations.forEach(combination => {
                  const newBid = {
                    user_id: userDetails.user_id,
                    game_id: (route.params as any)?.gameId || 0,
                    game_result_id: (route.params as any)?.gameResultId || 0,
                    bid_type_id: jugType?.id || selectedBidType,
                    bid_name: jugType?.display_name || 'Jugar',
                    bid_number: combination,
                    amount: jugarAmount,
                    session_type: selectedSession,
                  };
                  newBids.push(newBid);
                });
                
                setBidList([...bidList, ...newBids]);
                setJugarInput('/');
                setJugarAmount('');
                calculateTotalHelper([...bidList, ...newBids], setTotalAmount);
              }
            }}>
              <Icon name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Panna */}
          <View style={styles.inputRow}>
            <Text style={styles.rowTitle}>Panna</Text>
            <TextInput
              style={styles.numberInput}
              placeholder="Enter Panna"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={pannaInput}
              onChangeText={(value) => {
                const numericValue = value.replace(/[^0-9]/g, '');
                if (numericValue.length <= 3) {
                  setPannaInput(numericValue);
                }
              }}
              maxLength={3}
            />
            <View style={styles.priceBox}>
              <Text style={styles.priceIcon}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Price"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={pannaAmount}
                onChangeText={setPannaAmount}
              />
            </View>
            <TouchableOpacity style={styles.addRowBtn} onPress={() => {
              if (pannaInput && pannaAmount && pannaInput.length === 3) {
                const pannaTypeCode = getPannaType(pannaInput);
                const pannaType = bidTypesList.find(type => type.bid_code === pannaTypeCode);
                
                const newBid = {
                  user_id: userDetails.user_id,
                  game_id: (route.params as any)?.gameId || 0,
                  game_result_id: (route.params as any)?.gameResultId || 0,
                  bid_type_id: pannaType?.id || selectedBidType,
                  bid_name: pannaType?.display_name || 'Panna',
                  bid_number: pannaInput,
                  amount: pannaAmount,
                  session_type: selectedSession,
                };
                setBidList([...bidList, newBid]);
                setPannaInput('');
                setPannaAmount('');
                calculateTotalHelper([...bidList, newBid], setTotalAmount);
              }
            }}>
              <Icon name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Motor Panna */}
          <View style={styles.inputRow}>
            <Text style={styles.rowTitle}>Motor</Text>
            <TextInput
              style={styles.numberInput}
              placeholder="Enter Panna"
              placeholderTextColor="#888"
              keyboardType="numeric"
              onChangeText={(value) => {
                const numericValue = value.replace(/[^0-9]/g, '');
                if (numericValue.length <= 6) {
                  // Handle Motor input
                }
              }}
              maxLength={6}
            />
            <View style={styles.priceBox}>
              <Text style={styles.priceIcon}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Price"
                placeholderTextColor="#888"
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity style={styles.addRowBtn}>
              <Icon name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* SP */}
          <View>
            <Text style={styles.sectionTitle}>SP</Text>
            <View style={styles.bidTypeButtons}>
              {numberList.map((number) => (
                <TouchableOpacity 
                  key={number} 
                  style={[styles.bidTypeButton, selectedSPNumbers.includes(number) && {backgroundColor: '#4F46E5'}]}
                  onPress={() => {
                    if (selectedSPNumbers.includes(number)) {
                      setSelectedSPNumbers(selectedSPNumbers.filter(n => n !== number));
                    } else {
                      setSelectedSPNumbers([...selectedSPNumbers, number]);
                    }
                  }}
                >
                  <Text style={styles.bidTypeButtonText}>{number}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.priceBox}>
              <Text style={styles.priceIcon}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Price"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={spAmount}
                onChangeText={setSpAmount}
              />
            </View>
            <TouchableOpacity style={styles.addRowBtn} onPress={() => {
              if (selectedSPNumbers.length > 0 && spAmount) {
                const spType = bidTypesList.find(type => type.bid_code === 'SP');
                const combinations = generateMultiplePannaCombinations(selectedSPNumbers, 'SP');
                const newBids = [];
                
                combinations.forEach(combination => {
                  const newBid = {
                    user_id: userDetails.user_id,
                    game_id: (route.params as any)?.gameId || 0,
                    game_result_id: (route.params as any)?.gameResultId || 0,
                    bid_type_id: spType?.id || selectedBidType,
                    bid_name: spType?.display_name || 'SP',
                    bid_number: combination,
                    amount: spAmount,
                    session_type: selectedSession,
                  };
                  newBids.push(newBid);
                });
                
                setBidList([...bidList, ...newBids]);
                setSelectedSPNumbers([]);
                setSpAmount('');
                calculateTotalHelper([...bidList, ...newBids], setTotalAmount);
              }
            }}>
              <Icon name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* DP */}
          <View>
            <Text style={styles.sectionTitle}>DP</Text>
            <View style={styles.bidTypeButtons}>
              {numberList.map((number) => (
                <TouchableOpacity 
                  key={number} 
                  style={[styles.bidTypeButton, selectedDPNumbers.includes(number) && {backgroundColor: '#4F46E5'}]}
                  onPress={() => {
                    if (selectedDPNumbers.includes(number)) {
                      setSelectedDPNumbers(selectedDPNumbers.filter(n => n !== number));
                    } else {
                      setSelectedDPNumbers([...selectedDPNumbers, number]);
                    }
                  }}
                >
                  <Text style={styles.bidTypeButtonText}>{number}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.priceBox}>
              <Text style={styles.priceIcon}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Price"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={dpAmount}
                onChangeText={setDpAmount}
              />
            </View>
            <TouchableOpacity style={styles.addRowBtn} onPress={() => {
              if (selectedDPNumbers.length > 0 && dpAmount) {
                const dpType = bidTypesList.find(type => type.bid_code === 'DP');
                const combinations = generateMultiplePannaCombinations(selectedDPNumbers, 'DP');
                const newBids = [];
                
                combinations.forEach(combination => {
                  const newBid = {
                    user_id: userDetails.user_id,
                    game_id: (route.params as any)?.gameId || 0,
                    game_result_id: (route.params as any)?.gameResultId || 0,
                    bid_type_id: dpType?.id || selectedBidType,
                    bid_name: dpType?.display_name || 'DP',
                    bid_number: combination,
                    amount: dpAmount,
                    session_type: selectedSession,
                  };
                  newBids.push(newBid);
                });
                
                setBidList([...bidList, ...newBids]);
                setSelectedDPNumbers([]);
                setDpAmount('');
                calculateTotalHelper([...bidList, ...newBids], setTotalAmount);
              }
            }}>
              <Icon name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* KP */}
          <View>
            <Text style={styles.sectionTitle}>KP</Text>
            <View style={styles.bidTypeButtons}>
              {numberList.map((number) => (
                <TouchableOpacity key={number} style={styles.bidTypeButton}>
                  <Text style={styles.bidTypeButtonText}>{number}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.priceBox}>
              <Text style={styles.priceIcon}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Price"
                placeholderTextColor="#888"
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity style={styles.addRowBtn}>
              <Icon name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeaderRight}>
            <TouchableOpacity
              style={styles.placeBidBtnSmall}
              onPress={() => {
                placeBid();
              }}
            >
              <Icon name="rocket-launch" size={16} color="#fff" />
              <Text style={styles.placeBidTextSmall}>Place Bid</Text>
            </TouchableOpacity>
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
