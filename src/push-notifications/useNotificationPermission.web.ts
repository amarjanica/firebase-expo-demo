import React, { useEffect } from 'react';

const useNotificationPermission = () => {
  const [isRequesting, setIsRequesting] = React.useState(false);
  const [status, setStatus] = React.useState<NotificationPermission>('default');
  const checkForNotification = React.useCallback(async () => {
    if (!('Notification' in window)) {
      return 'denied';
    }

    try {
      return Notification.requestPermission();
    } catch (error) {
      console.error('Error checking notification permission', error);
      return 'denied';
    }
  }, []);

  useEffect(() => {
    setIsRequesting(true);
    checkForNotification()
      .then((status) => {
        console.log('Notification permission status - ', status);
        setStatus(status);
        setIsRequesting(false);
      })
      .catch((err) => {
        console.error('Error checking notification permission', err);
      })
      .finally(() => setIsRequesting(false));
  }, []);

  return {
    status,
    isRequesting,
    request: checkForNotification,
  };
};

export default useNotificationPermission;
