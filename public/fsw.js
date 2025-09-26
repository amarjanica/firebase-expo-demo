importScripts('https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js');

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('message', async (event) => {
  const replyBack = (message) => {
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage(message);
    }
  };

  if (event.data && event.data.type === 'INIT_FIREBASE') {
    if (firebase.apps.length) {
      console.log('Firebase already initialized in service worker');
      replyBack({ type: 'FIREBASE_INITIALIZED' });
      return;
    }

    const firebaseConfig = event.data.config;

    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] Received background message ', payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });

    console.log('Firebase initialized in service worker');
    replyBack({ type: 'FIREBASE_INITIALIZED' });
  }
});
