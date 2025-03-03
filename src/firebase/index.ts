import Constants from 'expo-constants'

const firebase = (Constants.appOwnership === 'expo') ? require('./firebaseWeb').default : require('./firebaseNative').default;

export default firebase;
