import { CustomerInfo } from 'react-native-purchases';
import React from 'react';

export const configureRevenueCat = async ({ appUserID }: { appUserID?: string }): Promise<boolean> => {
  return true;
};

const RC = React.createContext<{
  customerInfo: CustomerInfo | null;
  isSubscriber: boolean;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfo | null>>;
  isConfigured: boolean;
} | null>(null);

export const RCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerInfo, setCustomerInfo] = React.useState<any>(null);
  return (
    <RC.Provider value={{ customerInfo, isSubscriber: false, setCustomerInfo, isConfigured: true }}>
      {children}
    </RC.Provider>
  );
};

export const useRC = () => {
  const ctx = React.useContext(RC);

  return ctx;
};
