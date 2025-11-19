import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#0F243D',
    paddingVertical: 0,
    paddingHorizontal: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  activeNavItem: {
    transform: [{ scale: 1.05 }],
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  activeIconContainer: {
    backgroundColor: '#0F243D',
    shadowColor: '#0F243D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderRadius: 20,
  },
  navLabel: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeNavLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
});