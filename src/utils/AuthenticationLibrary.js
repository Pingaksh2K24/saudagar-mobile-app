import SecureStorage from "./secureStorage";

// Fetch token using callback pattern like ProfileScreen
export const fetchToken = () => {
    return new Promise((resolve, reject) => {
        SecureStorage.getUserSession(
            (session) => {
                if (session?.token) {
                    resolve(session.token);
                } else {
                    console.log('No token found');
                    resolve(null);
                }
            },
            (error) => {
                console.log('Error fetching token:', error);
                reject(error);
            }
        );
    });
};