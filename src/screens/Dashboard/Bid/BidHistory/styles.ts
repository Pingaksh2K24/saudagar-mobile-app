import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  totalBids: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
  noDataText: {
    color: '#64748Bp',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  historyContainer: {
    marginBottom: 20,
  },
  bidCard: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    borderWidth: 1,
    borderColor: '#3B82F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  bidCardInner: {
    padding: 10,
  },
  bidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  bidTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bidType: {
    fontSize: 13,
    color: '#F59E0B',
    fontWeight: '500',
  },
  sessionType: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  bidDetails: {
    gap: 0,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    paddingLeft: 8,
    flex: 1,
    textAlign: 'left',
    flexShrink: 1,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 14,
  },
  noMoreContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noMoreText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
