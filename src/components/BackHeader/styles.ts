import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 10,
    paddingTop: 30,
    position: 'relative',
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    padding: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    position: 'absolute',
    left: 0,
    right: 0,
    marginTop: 40,
    textAlign: 'center',
  }
});