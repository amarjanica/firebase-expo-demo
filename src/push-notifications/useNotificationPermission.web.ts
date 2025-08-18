const useNotificationPermission = () => {
  return {
    status: 'denied',
    isRequesting: false,
    request: null,
  };
};

export default useNotificationPermission;
