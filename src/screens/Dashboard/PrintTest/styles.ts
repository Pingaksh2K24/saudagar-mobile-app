import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 15,
  },
  scanButton: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  devicesList: {
    maxHeight: 300,
  },
  deviceItem: {
    backgroundColor: '#0F243D',
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectedDevice: {
    backgroundColor: '#063e2bff',
    opacity: 0.8,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flex: 1,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  deviceAddress: {
    color: '#fff',
    fontSize: 12,
  },
  printButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  printButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});