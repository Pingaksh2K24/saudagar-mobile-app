// ============================================
// USER RELATED TYPES
// ============================================

// User session data interface
export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
}

// User session response interface
export interface UserSession {
  user: User;
  token?: string;
}

// ============================================
// BID RELATED TYPES
// ============================================

// Individual bid data interface
export interface BidData {
  user_id?: any;
  game_id?: number;
  game_result_id?: number;
  bid_type_id?: any;
  bid_name?: string;
  bid_number?: string;
  amount?: string;
  session_type?: string;
  id?: any;
  display_name?: string;
  bid_code?: string;
}

// Bid type interface
export interface BidType {
  id: number;
  display_name: string;
  bid_code: string;
  description?: string;
}

// Bid history item interface
export interface BidHistoryItem {
  id: string;
  game_name: string;
  bid_type_name: string;
  bid_number: string;
  amount: string;
  session_type: string;
  status: 'won' | 'lost' | 'submitted';
  created_date: string;
}

// ============================================
// GAME RELATED TYPES
// ============================================

// Game parameters interface
export interface GameParams {
  gameId: number;
  gameName: string;
  availableSessions: string[];
  openTime?: string;
  closeTime?: string;
  gameResultId?: number;
}

// Game info interface
export interface GameInfo {
  id: number;
  name: string;
  open_time: string;
  close_time: string;
  status: string;
}

// ============================================
// RECEIPT RELATED TYPES
// ============================================

// Receipt info interface
export interface ReceiptInfo {
  receipt_no: string;
  agent_name: string;
  total_amount: number;
  total_bids: number;
  session: string;
  receipt_date: string;
}

// Receipt data interface
export interface ReceiptData {
  receipt_info: ReceiptInfo;
  bids: BidData[];
}

// Receipt list item interface
export interface ReceiptListItem {
  id: string;
  receipt_no: string;
  total_amount: number;
  total_bids: number;
  session: string;
  receipt_date: string;
}

// ============================================
// API RELATED TYPES
// ============================================

// Generic API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
}

// Pagination interface
export interface Pagination {
  current_page: number;
  total_pages: number;
  has_more: boolean;
  total_items: number;
}

// API error interface
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// ============================================
// NAVIGATION RELATED TYPES
// ============================================

// Navigation props interface
export interface NavigationProps {
  navigation: any;
  route: any;
}

// Back header props interface
export interface BackHeaderProps {
  title: string;
  onNotificationPress?: () => void;
  onBackPress?: () => void;
}

// Bottom navigation props interface
export interface BottomNavigationProps {
  activeTab?: string;
  onTabPress?: (tab: string) => void;
}

// ============================================
// FORM RELATED TYPES
// ============================================

// Sign in form props interface
export interface SignInFormProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

// ============================================
// NOTIFICATION RELATED TYPES
// ============================================

// Notification data interface
export interface NotificationData {
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

// ============================================
// MODAL RELATED TYPES
// ============================================

// Telegram modal props interface
export interface TelegramModalProps {
  visible: boolean;
  onClose: () => void;
  agentName: string;
  agentMobile: string;
  message: string;
  onMessageChange: (text: string) => void;
  onSend: () => void;
}

// ============================================
// SERVICE RELATED TYPES
// ============================================

// Message data for contact services
export interface ContactMessageData {
  agentName: string;
  agentMobile: string;
  message: string;
}

// Service response interface
export interface ServiceResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// ============================================
// CONTACT RELATED TYPES
// ============================================

// Contact method interface
export interface ContactMethod {
  type: string;
  value: string;
  icon: string;
  action: () => void;
}

// Support hours interface
export interface SupportHours {
  day: string;
  time: string;
}