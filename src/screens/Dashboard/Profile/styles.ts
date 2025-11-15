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
    color: '#FFFFFF',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  optionsContainer: {
    marginTop: 5,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
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