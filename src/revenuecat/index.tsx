import Purchases, { CustomerInfo } from 'react-native-purchases';
import { Platform } from 'react-native';
import React from 'react';

export const configureRevenueCat = async ({
  appUserID
}: {
  appUserID ?: string
}): Promise<boolean> => {
  try {
    const apiKey = Platform.select({
      ios: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS,
      android: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID,
    })
    if (!apiKey) {
      // This repository is showcasing expo firebase features and I don't want
      // the app to crash if api key for revenucat is not set.
      // throw new Error('apiKey not found!');
      return false;
    }
    if (__DEV__) {
      await Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    }

    Purchases.configure({
      apiKey,
      appUserID,
      entitlementVerificationMode: Purchases.ENTITLEMENT_VERIFICATION_MODE.INFORMATIONAL,
    })
    console.log('RevenueCat configured');
    return true
  } catch (error) {
    console.error('Error configuring RevenueCat:', error);
    return false
  }
}

const RC = React.createContext<{
  customerInfo: CustomerInfo | null;
  isSubscriber: boolean;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfo | null>>;
  isConfigured: boolean;
} | null>(null);

export const RCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerInfo, setCustomerInfo] = React.useState<CustomerInfo | null>(null);
  const [isConfigured, setIsConfigured] = React.useState(false);
  const mounted = React.useRef(false);

  React.useEffect(() => {
    if (mounted.current){
      return;
    }

    const prepare = async () => {
      mounted.current = true
      const configured = await configureRevenueCat({
        appUserID: ''
      })
      setIsConfigured(configured)
    }

    void prepare();
  }, []);

  return (
    <RC.Provider value={{ customerInfo, isSubscriber: !!customerInfo?.entitlements.active.pro?.isActive, setCustomerInfo, isConfigured }}>
      {children}
    </RC.Provider>
  );
}

export const useRC = () => {
  const ctx = React.useContext(RC);
  if (!ctx){
    throw new Error('RevenueCat should be used within RC')
  }
  return ctx;
}
