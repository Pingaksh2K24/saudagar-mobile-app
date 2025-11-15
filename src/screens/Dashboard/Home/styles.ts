import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000B43',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  logoSection: {
    alignItems: 'center',
    marginBottom: 0,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  gamesContainer: {
    gap: 15,
  },
  gameCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gameDetails: {
    marginTop: 8,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  timeLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  timeValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  winningNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F59E0B',
    letterSpacing: 1,
    textAlign: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  noGamesText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});