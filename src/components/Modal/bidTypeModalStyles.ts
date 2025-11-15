import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdownModal: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 10,
    minWidth: 200,
    maxWidth: 300,
    borderWidth: 1,
    borderColor: '#333',
    zIndex: 9999,
    elevation: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  selectedDropdownItem: {
    backgroundColor: '#EF4444',
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedDropdownItemText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});