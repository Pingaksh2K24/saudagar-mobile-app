import { LogBox } from 'react-native';

// Suppress specific warnings
LogBox.ignoreLogs([
  'InteractionManager has been deprecated',
  'new NativeEventEmitter',
  'Require cycle:',
]);

// Suppress all warnings in production
if (__DEV__ === false) {
  console.warn = () => {};
  console.error = () => {};
}