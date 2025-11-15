import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { BackHeader } from '../../../../components/BackHeader/BackHeader';
import { BottomNavigation } from '../../../../components/BottomMenu/BottomMenu';
import { Loader } from '../../../../components/Loader/Loader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import DashboardServices from '../../../../services/axiosServices/apiServices/DashboardServices';
import SecureStorage from '../../../../utils/secureStorage';
import { formatDateTime } from '../../../../utils/helper';
import { styles } from './styles';

export const BidHistoryScreen: React.FC = () => {
  const [bidHistoryList, setBidHistoryList] = useState<any[]>([]);
  const [userId, setUserId] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalBids, setTotalBids] = useState(0);

  const dashboardServices = new DashboardServices();

  useEffect(() => {
    SecureStorage.getUserSession(
      (session: any) => {
        if (session?.user) {
          setUserId(session?.user?.id);
        }
      },
      (error: any) => {
        console.log('Error getting user session:', error);
      }
    );
  }, []);

  useEffect(() => {
    if (userId) {
      setPage(1);
      setHasMore(true);
      setBidHistoryList([]);
      getBidsByUser(1, false);
    }
  }, [userId]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      console.log('Loading next page:', nextPage);
      setPage(nextPage);
      getBidsByUser(nextPage, true);
    }
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 50;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const getBidsByUser = (pageNum = 1, append = false) => {
    if (loading || !userId) return;
    console.log('getBidsByUser called:', { pageNum, append, userId });
    setLoading(true);
    let request = [userId, pageNum];
    dashboardServices
      .getBidsByUser(request)
      .then((response: any) => {
        console.log('Get Bid History Response:', response);
        if (response?.data?.bids) {
          const newBids = response.data.bids;
          const pagination = response.data.pagination;
          setBidHistoryList((prev: any[]) => {
            const result = append ? [...prev, ...newBids] : newBids;
            console.log('Updated bid list length:', result.length);
            return result;
          });

          // Set total bids count from pagination
          setTotalBids(pagination?.total_bids || 0);
          // Set hasMore based on API pagination response
          setHasMore(pagination?.has_more || false);
        } else {
          console.log('Unknown response structure');
          setHasMore(false);
        }
        setLoading(false);
      })
      .catch((error: any) => {
        console.log('Error fetching bids:', error);
        setLoading(false);
        setHasMore(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Bid History" />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            handleLoadMore();
          }
        }}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Bid History: </Text>
          <Text style={styles.totalBids}>{totalBids}</Text>
        </View>

        {loading && bidHistoryList.length === 0 ? (
          <Loader color="#FFFFFF" />
        ) : bidHistoryList.length === 0 ? (
          <Text style={styles.noDataText}>No bid history found</Text>
        ) : (
          <View style={styles.historyContainer}>
            {bidHistoryList.map((bid: any, index: number) => (
              <LinearGradient
                key={`${bid.id}-${index}`}
                colors={['#1B2951', '#2D3748', '#1B2951']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bidCard}
              >
                <TouchableOpacity style={styles.bidCardInner}>
                  <View style={styles.bidHeader}>
                    <View style={styles.gameInfo}>
                      <Text style={styles.gameName}>{bid.game_name}</Text>
                      <View style={styles.bidTypeRow}>
                        <Text style={styles.bidType}>
                          {bid.bid_type_name} -
                        </Text>
                        <Text style={styles.sessionType}>
                          {bid.session_type}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            bid.status === 'won'
                              ? '#10B981'
                              : bid?.status === 'submitted'
                                ? '#746208ff'
                                : '#EF4444',
                        },
                      ]}
                    >
                      <Icon
                        name={
                          bid.status === 'won'
                            ? 'trending-up'
                            : bid?.status === 'submitted'
                              ? 'trending-flat'
                              : 'trending-down'
                        }
                        size={14}
                        color="#FFFFFF"
                      />
                      <Text style={styles.statusText}>{bid.status}</Text>
                    </View>
                  </View>

                  <View style={styles.bidDetails}>
                    <View style={styles.detailRow}>
                      <View style={styles.detailItem}>
                        <View style={styles.iconContainer}>
                          <Icon
                            name="confirmation-number"
                            size={16}
                            color="#EF4444"
                          />
                        </View>
                        <Text style={styles.detailLabel}>Number:</Text>
                        <Text style={styles.detailValue}>{bid.bid_number}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <View style={styles.iconContainer}>
                          <Icon
                            name="account-balance-wallet"
                            size={16}
                            color="#10B981"
                          />
                        </View>
                        <Text style={styles.detailLabel}>Amount:</Text>
                        <Text style={styles.detailValue}>₹{bid.amount}</Text>
                      </View>
                    </View>
                    <View style={styles.detailRow}>
                      <View style={styles.iconContainer}>
                        <Icon name="schedule" size={16} color="#F59E0B" />
                      </View>
                      <Text style={styles.detailLabel}>Date:</Text>
                      <Text style={styles.detailValue}>
                        {formatDateTime(bid.created_date)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            ))}
            {loading && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            )}
            {!hasMore && bidHistoryList.length > 0 && (
              <View style={styles.noMoreContainer}>
                <Text style={styles.noMoreText}>No more bids available</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <BottomNavigation activeTab="Bidding" />
    </SafeAreaView>
  );
};
