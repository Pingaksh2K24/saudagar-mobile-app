export const config = {
  API_URL: 'https://your-api-url.com/api',
  APP_NAME: 'Saudagar',
  VERSION: '1.0.0',
  
  // Feature flags
  features: {
    enablePushNotifications: true,
    enableAnalytics: true,
    enableCrashReporting: true,
  },
  
  // Timeouts
  timeouts: {
    api: 10000,
    upload: 30000,
  },
  
  // Pagination
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
};