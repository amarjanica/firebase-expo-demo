import RevenueCatUI from 'react-native-purchases-ui';
import { useRC } from '@/revenuecat';
import { Redirect, router } from 'expo-router';
import { CustomerInfo } from 'react-native-purchases';

const Page = () => {
  const ctx = useRC();
  const handleCustomer = ({customerInfo}: {customerInfo: CustomerInfo}) => {
      ctx.setCustomerInfo(customerInfo)
      router.push('/')
  }

  if (!ctx.isConfigured){
    return null;
  }

  if (ctx.isSubscriber){
    return <Redirect href="/" />
  }

  return (
    <RevenueCatUI.Paywall
      onPurchaseCompleted={handleCustomer}
      onRestoreError={(err) => {
        console.error(err.error, 'restore error')
      }}
      onRestoreCompleted={handleCustomer}
      onDismiss={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.push('/');
        }
      }}
      options={{
        offering: {
          identifier: process.env.EXPO_PUBLIC_REVENUECAT_OFFERING_ID,
        } as any,
      }}
    />
  );
}

export default Page;
