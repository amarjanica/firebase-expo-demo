import { getApp, getApps } from '@react-native-firebase/app';
console.log('native')
export default {
  app: getApp(),
  running: getApps().length > 0,
};
