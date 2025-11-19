import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Modal, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native';
import { BottomNavigation } from '../../../components/BottomMenu/BottomMenu';
import { SideMenu } from '../../../components/SideMenu/SideMenu';
import { Header } from '../../../components/Header/Header';
import { Loader } from '../../../components/Loader/Loader';
import { DialogBox } from '../../../components/DialogBox/DialogBox';
import DashboardServices from '../../../services/axiosServices/apiServices/DashboardServices';
import { convertTo12HourFormat, getGameStatus } from '../../../utils/helper';
import { styles } from './styles';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [gameList, setGameList] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');

  const dashboardServices = new DashboardServices();

  useEffect(() => {
    gameResultList();
  }, []);

  const gameResultList = () => {
    setIsLoading(true);
    dashboardServices.gameResultList().then((response:any) => {
      console.log('Game Result List Response ::', response);
      if (
        response &&
        response?.statusCode === 200 &&
        response.success === true
      ) {
        const resp = response?.data?.results;
        const finalGameList = resp?.map((item: any) => ({
          ...item,
          open_result: item?.open_result || 'XXX',
          close_result: item?.close_result || 'XXX',
          winning_number:
            item?.winning_number?.toString().length === 2
              ? item?.winning_number
              : item?.winning_number?.toString().length === 1
                ? item?.winning_number + 'X'
                : 'XX',
        }));
        // setGameList(finalGameList);
        //
        setGameList(Array.isArray(finalGameList) ? finalGameList : []);
      } else {
        console.log(' Unknown response structure');
      }
      setIsLoading(false);
    });
  };

  const toggleMenu = () => {
    console.log('Toggle menu called, current state:', isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#DC2626" />
      {/* Header */}
      <Header
        onMenuPress={toggleMenu}
        onNotificationPress={() => console.log('Notification clicked')}
      />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          {/* <Text style={styles.appName}>Saudagar</Text> */}
        </View>

        {/* Games List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Games</Text>
          {isLoading ? (
            <Loader color="#6B7280" />
          ) : (
          <View style={styles.gamesContainer}>
            {gameList && gameList.length > 0 ? (
              gameList.map((game: any) => (
                <TouchableOpacity
                  key={game?.game_id}
                  onPress={() => {
                    const gameStatus = getGameStatus(game?.open_time, game?.close_time);
                    let availableSessions = [];

                    if (gameStatus.status === 'Open') {
                      availableSessions = ['Open', 'Close'];
                    } else if (gameStatus.status === 'Bidding for Close') {
                      availableSessions = ['Close'];
                    } else {
                      setDialogTitle('Bidding Closed');
                      setDialogMessage(`${game?.game_name} bidding is closed. Please try again tomorrow.`);
                      setShowDialog(true);
                      return;
                    }

                    if (availableSessions.length > 0) {
                      console.log('Navigating with gameResultId:', game?.result_id);
                      (navigation as any).navigate('BidPlacement', {
                      gameId: game?.game_id,
                      gameName: game?.game_name,
                      gameResultId: game?.result_id,
                      availableSessions,
                      openTime: game?.open_time,
                      closeTime: game?.close_time,
                    });
                    }
                  }}
                >
                  <View style={styles.gameCard}>
                    <View style={styles.gameHeader}>
                      <Text style={styles.gameName}>{game?.game_name}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: getGameStatus(game?.open_time, game?.close_time).color,
                          },
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {getGameStatus(game?.open_time, game?.close_time).status}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.gameDetails}>
                      <View style={styles.timeRow}>
                        <Text style={styles.timeLabel}>Open: </Text>
                        <Text style={styles.timeValue}>{convertTo12HourFormat(game?.open_time)}</Text>
                        <Text style={styles.timeLabel}> Close: </Text>
                        <Text style={styles.timeValue}>{convertTo12HourFormat(game?.close_time)}</Text>
                      </View>
                      <Text
                        style={styles.winningNumber}
                      >{`${game?.open_result}-${game?.winning_number}-${game?.close_result}`}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noGamesText}>No games available</Text>
            )}
          </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="Home" />

      {/* Side Menu Modal */}
      <Modal
        visible={isMenuOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsMenuOpen(false)}
        statusBarTranslucent={true}
      >
        <SideMenu isVisible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </Modal>

      <DialogBox
        visible={showDialog}
        type="warning"
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={() => setShowDialog(false)}
        confirmText="OK"
      />
    </SafeAreaView>
  );
};


