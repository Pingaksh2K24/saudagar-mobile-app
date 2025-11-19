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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 80,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F243D',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 16,
    color: '#0F243D',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F243D',
    padding: 10,
    borderRadius: 15,
    marginBottom: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 15,
  },
  logoutOption: {
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  logoutText: {
    color: '#EF4444',
  },
});