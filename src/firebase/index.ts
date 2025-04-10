// Supporting Expo GO is useless as most apps have native code
// const firebase = (Constants.appOwnership === 'expo') ? require('./firebaseWeb').default : require('./firebaseNative').default;
//
// export default firebase;

export { default } from './firebaseNative';
