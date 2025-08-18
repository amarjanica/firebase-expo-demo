import {
  checkNotifications,
  requestNotifications,
  type PermissionStatus,
  type NotificationsResponse,
} from 'react-native-permissions';
import { useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const useNotificationPermission = () => {
  const [notificationResponse, setNotificationResponse] = useState<NotificationsResponse | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const refresh = useCallback(async (): Promise<void> => {
    const res = await checkNotifications();
    setNotificationResponse(res);
  }, []);

  const request = useCallback(async (): Promise<PermissionStatus> => {
    setIsRequesting(true);
    try {
      const res = await requestNotifications(['alert', 'badge', 'sound']);
      setNotificationResponse(res);
      return res.status;
    } finally {
      setIsRequesting(false);
    }
  }, []);

  useEffect(() => {
    request()
      .then((response) => {
        console.debug('Notification request request - ', response);
      })
      .catch((err) => console.debug('Failed to refresh notification permissions', err));
  }, []);

  useEffect(() => {
    refresh().catch((err) => console.debug('Failed to refresh notification permissions', err));

    const onChange = (next: AppStateStatus) => {
      if (next === 'active') {
        refresh().catch((err) => console.debug('Failed to refresh notification permissions', err));
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [refresh]);

  return {
    status: notificationResponse?.status,
    isRequesting,
    request,
  };
};

export default useNotificationPermission;
