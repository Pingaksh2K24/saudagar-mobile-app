import { IsProdMode } from '../../utils/AppSetting';
// Web API url
export const APIURL = IsProdMode ? 'https://saudagar-backend.onrender.com/api/' : 'http://10.0.2.2:3000/api/';
// export const APIURL = 'http://10.0.2.2:3000/api/'

//Authentication services
export const UserLogin = 'auth/login';
export const Logout = 'auth/logout';

// Dashboard services
export const GameResultList = 'results/today-results';
export const BidTypes = 'bids/types';
export const BidPlace = 'bids/place'
export const GetBidsByUser = 'bids/user/{user_id}/mobile?page=1&limit=10';
export const GetAgentReceipts = 'bids/get-receipt-by-agent/{0}';
export const GetReceiptDetails = 'bids/receipt-details/{0}';

// GET http://localhost:3000/api/bids/user/{user_id}/mobile?page=1&limit=10




