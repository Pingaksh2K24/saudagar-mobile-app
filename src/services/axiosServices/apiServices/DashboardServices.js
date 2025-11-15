import {
  axiosGetAuthorize,
  axiosPostAuthorize,
  axiosGetMultiParams,
} from '../AxiosRequests';
import {
  GameResultList,
  BidTypes,
  BidPlace,
  GetBidsByUser,
  GetAgentReceipts,
  GetReceiptDetails,
} from '../ApiEndPoints';

export default class DashboardServices {
  async gameResultList(request) {
    return axiosGetAuthorize(GameResultList, request);
  }

  async bidTypes(request) {
    return axiosGetAuthorize(BidTypes, request);
  }

  async bidPlace(request) {
    return axiosPostAuthorize(BidPlace, request);
  }

  async getBidsByUser(request) {
    return axiosGetMultiParams(GetBidsByUser, request);
  }

  async getReceiptsByAgent(agentId) {
    return axiosGetAuthorize(GetAgentReceipts, agentId);
  }

  async getReceiptDetails(receiptId) {
    return axiosGetAuthorize(GetReceiptDetails, receiptId);
  }
}
