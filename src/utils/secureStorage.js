import EncryptedStorage from 'react-native-encrypted-storage';

const SecureStorage = {
  storeUserSession: (userData, onSuccess, onError) => {
    EncryptedStorage.setItem(
      'user_session',
      JSON.stringify({
        token: userData?.data.token.accessToken,
        user: userData?.data.user,
      })
    )
      .then(() => {
        console.log('✅ User session saved!');
        onSuccess && onSuccess();
      })
      .catch((error) => {
        console.log('Storage error:', error);
        onError && onError(error);
      });
  },

  getUserSession: (onSuccess, onError) => {
    EncryptedStorage.getItem('user_session')
      .then((session) => {
        if (session) {
          const parsed = JSON.parse(session);
          onSuccess && onSuccess(parsed);
        } else {
          onSuccess && onSuccess(null);
        }
      })
      .catch((error) => {
        console.log('Get session error:', error);
        onError && onError(error);
      });
  },

  clearUserSession: (onSuccess, onError) => {
    EncryptedStorage.removeItem('user_session')
      .then(() => {
        onSuccess && onSuccess();
      })
      .catch((error) => {
        console.log('Clear session error:', error);
        onError && onError(error);
      });
  },
};

export default SecureStorage;
