import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000B43',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop:20,
  },
  receiptCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  receiptId: {
    fontSize: 14,
    color: '#666',
  },
  logo: {
    width: 100,
    height: 100,
    marginRight: 15,
  },
  gameName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 5,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  leftInfo: {
    alignItems: 'flex-start',
  },
  rightInfo: {
    alignItems: 'flex-end',
  },
  agentLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  agentName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  dateTime: {
    fontSize: 14,
    color: '#333',
  },
  bidFor: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  bidDetailsSection: {
    marginBottom: 5,
  },
  bidDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 5,
  },
  headerCol1: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  headerCol2: {
    flex: 2,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  headerCol3: {
    flex: 2,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  headerCol4: {
    flex: 1.5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  col1: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  col2: {
    flex: 2,
    fontSize: 14,
    color: '#333',
  },
  col3: {
    flex: 2,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  col4: {
    flex: 1.5,
    fontSize: 14,
    color: '#10B981',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  totalSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 20,
    color: '#10B981',
    fontWeight: 'bold',
  },
  dividerLine: {
    height: 2,
    backgroundColor: '#333',
    marginVertical: 5,
    borderStyle: 'dashed',
  },
  instructionText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    marginBottom: 100,
    paddingBottom: 20,
  },
  printBtn: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  printBtnText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});