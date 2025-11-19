import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  formSection: {
    width: '100%',
    marginTop: 0,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
    flex: 1,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
    marginTop: 0,
    fontWeight: '400',
  },
  textInput: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    width: '60%',
    alignSelf: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#7F8C8D',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }, 
  logoSection: {
    alignItems: 'center',
    marginBottom:40,
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 120,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  logoSubText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '400',
  },
});