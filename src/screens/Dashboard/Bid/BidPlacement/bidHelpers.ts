import DashboardServices from '../../../../services/axiosServices/apiServices/DashboardServices';
import { BidData } from '../../../../utils/types';

// Navigate to receipt screen without API call
export const placeBid = (
  bidList: BidData[],
  showNotification: any,
  navigation: any,
  gameName: string,
  totalAmount: number,
  userDetails: any,
  selectedSession: string,
  routeParams: any
) => {
  if (bidList.length === 0) {
    showNotification({
      type: 'error',
      title: 'Error',
      message: 'Please add at least one bid',
    });
    return;
  }
  
  navigation.navigate('BidReceipt', {
    gameName,
    bids: bidList,
    totalAmount,
    userName: userDetails.name,
    selectedSession,
    gameParams: routeParams,
    userId: userDetails.user_id,
  });
};

// Fetch available bid types from API
export const getBidTypes = (
  dashboardServices: DashboardServices,
  setIsLoading: (loading: boolean) => void,
  setBidTypesList: (types: any[]) => void
) => {
  setIsLoading(true);
  dashboardServices.bidTypes().then((response: any) => {
    console.log('Bid Types Response:', response);
    if (
      response &&
      response?.statusCode === 200 &&
      response?.success === true
    ) {
      setBidTypesList(
        Array.isArray(response?.data.results) ? response?.data.results : []
      );
    } else {
      console.log(' Unknown response structure');
    }
    setIsLoading(false);
  });
};

// Get minimum required length for selected bid type
export const getMinLength = (selectedBidType: number, bidTypesList: any[]) => {
  const selectedType = bidTypesList.find(type => type.id === selectedBidType);
  if (selectedType?.bid_code === 'JD') {
    return 2; // Jodi Digit requires exactly 2 digits
  }
  switch (selectedBidType) {
    case 1: // Single Digit
      return 1;
    case 2: // Jodi Digit
      return 2;
    case 3: // Single Panna
    case 4: // Double Panna
    case 5: // Triple Panna
      return 3;
    case 6: // Half Sangam
      return 5; // 00-000 format
    case 7: // Full Sangam
      return 7; // 00-00-000 format
    default:
      return 1;
  }
};

// Add current bid to the bid list
export const addBidRow = (
  currentBid: BidData,
  bidList: BidData[],
  selectedBidType: number,
  selectedBidName: string,
  selectedSession: string,
  userDetails: any,
  routeParams: any,
  bidTypesList: any[],
  showNotification: any,
  setBidList: (bids: BidData[]) => void,
  setCurrentBid: (bid: BidData) => void,
  calculateTotalFn: (bids: BidData[]) => void,
  numberInputRef: any
) => {
  const minLength = getMinLength(selectedBidType, bidTypesList);
  const currentLength = currentBid.bid_number?.length || 0;
  
  if (!currentBid.bid_number || !currentBid.amount) {
    showNotification({
      type: 'error',
      title: 'Error',
      message: 'Please enter both number and amount',
    });
    return;
  }
  
  if (currentLength < minLength) {
    const selectedType = bidTypesList.find(type => type.id === selectedBidType);
    showNotification({
      type: 'error',
      title: 'Invalid Input',
      message: `${selectedType?.display_name || 'This bid type'} requires exactly ${minLength} digit${minLength > 1 ? 's' : ''}`,
    });
    return;
  }
  
  if (currentBid.bid_number && currentBid.amount) {
    const selectedType = bidTypesList.find(type => type.id === selectedBidType);
    let multipliedAmount = currentBid.amount;
    
    if (selectedType?.bid_code === 'JUG') {
      const parts = currentBid.bid_number.split('/');
      if (parts.length === 2) {
        const beforeSlash = parts[0].replace(/\D/g, '').length;
        const afterSlash = parts[1].replace(/\D/g, '').length;
        const multiplier = beforeSlash * afterSlash;
        multipliedAmount = (parseInt(currentBid.amount) * multiplier).toString();
      }
    }
    
    const newBidList = [
      ...bidList,
      {
        ...currentBid,
        user_id: userDetails.user_id,
        game_id: routeParams?.gameId || 0,
        game_result_id: routeParams?.gameResultId || 0,
        bid_type_id: selectedBidType,
        bid_name: selectedBidName,
        session_type: selectedSession,
        amount: multipliedAmount,
      },
    ];
    setBidList(newBidList);
    setCurrentBid({
      ...currentBid,
      bid_number: '',
      amount: '',
      bid_type_id: selectedBidType,
    } as BidData);
    calculateTotalFn([
      ...bidList,
      { ...currentBid, bid_type_id: selectedBidType } as BidData,
    ]);
    numberInputRef.current?.focus();
    console.log('Bid added List :', bidList);
  }
};

// Remove bid from the bid list by index
export const removeBidRow = (
  index: number,
  bidList: BidData[],
  setBidList: (bids: BidData[]) => void,
  calculateTotalFn: (bids: BidData[]) => void
) => {
  const newBids = bidList.filter((_, i) => i !== index);
  setBidList(newBids);
  calculateTotalFn(newBids);
};

// Update current bid input with length validation for bid number
export const updateCurrentBid = (
  field: 'bid_number' | 'amount',
  value: string,
  currentBid: BidData,
  selectedBidType: number,
  bidTypesList: any[],
  setCurrentBid: (bid: BidData) => void
) => {
  if (field === 'bid_number') {
    if (value.length <= getMaxLength(selectedBidType, bidTypesList)) {
      setCurrentBid({
        ...currentBid,
        [field]: value,
        bid_type_id: selectedBidType,
      });
    }
  } else {
    setCurrentBid({
      ...currentBid,
      [field]: value,
      bid_type_id: selectedBidType,
    });
  }
};

// Calculate total amount from all bids in the list
export const calculateTotal = (
  bidList: BidData[],
  setTotalAmount: (amount: number) => void
) => {
  const total = bidList.reduce(
    (sum: number, bid: BidData) => sum + (parseFloat(bid.amount || '0') || 0),
    0
  );
  setTotalAmount(total);
};

// Get placeholder text based on selected bid type
export const getNumberPlaceholder = (selectedBidType: number) => {
  switch (selectedBidType) {
    case 1:
      return 'Enter 0-9';
    case 2:
      return 'Enter 00-99';
    case 3:
    case 4:
    case 5:
      return 'Enter 000-999';
    case 6:
      return 'Enter 00-000';
    case 7:
      return 'Enter 00-00-000';
    default:
      return 'Enter number';
  }
};

// Get maximum input length based on selected bid type
export const getMaxLength = (selectedBidType: number, bidTypesList: any[]) => {
  const selectedType = bidTypesList.find(type => type.id === selectedBidType);
  if (selectedType?.bid_code === 'JUG') {
    return 15;
  }
  switch (selectedBidType) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
    case 4:
    case 5:
      return 3;
    case 6:
      return 6;
    case 7:
      return 8;
    default:
      return 10;
  }
};