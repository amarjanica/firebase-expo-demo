# Firebase with Expo (Native & Web)

This app shows how to use Firebase with Expo on both native and web.
It's a companion project for my blog and YouTube tutorials regarding firebase. 
Each chapter follows a lecture, and I'll update it as I release new content.
I have ideas for future chapters, but I'm open to [suggestions](https://github.com/amarjanica/firebase-expo-demo/discussions). Let me know what you'd like to see.


## Get started

- Get Firebase config
  - Go to the [Firebase Console](https://console.firebase.google.com/)
  - Create a new project
  - Add a web/android/ios app
  - Copy the config object - for Android it's google-services.json, for iOS it's GoogleService-Info.plist.
  - Web related firebase config should be configured through environment variables, in the .env file.

- Install dependencies

   ```bash
   npm install
   ```
- Start the app

   ```bash
    npm run android # or npm run ios
   ```


## Chapters

If you're interested in a particular tutorial, I'd suggest looking in [Releases](https://github.com/amarjanica/firebase-expo-demo/releases).
As I add new chapters, I refactor and sometimes something older might not work, like react native web if I forget to polyfill it.
If you notice anything buggy, please report in [Issues](https://github.com/amarjanica/firebase-expo-demo/issues)

1. [Getting started - configuring firebase for expo go, native and web.](https://www.amarjanica.com/getting-started-with-firebase-on-expo-go-native-and-web/)
2. [Analytics - tracking user events](https://www.amarjanica.com/google-analytics-in-expo-firebase-setup-for-native-and-web)
3. [Google login](https://www.amarjanica.com/making-google-login-work-in-react-native-and-web/)
4. [Monetize app with subscriptions](https://www.amarjanica.com/enable-subscriptions-in-expo-2/)
5. [Set up Crashlytics and Sentry](https://www.amarjanica.com/how-i-debug-production-bugs-in-react-native/)
6. [Enable Push notifications - Expo](https://www.amarjanica.com/how-to-set-up-push-notifications-in-expo/)
7. [Send Push notifications from NestJS](https://www.amarjanica.com/server-side-push-notifications-with-nestjs-and-firebase/)

### About Expo Go
In my earlier articles, I did support Expo Go, but I decided to remove it.
Personally, I don't use it, I use either native builds or bundled development client builds.
Expo Go doesn't support native modules, so I don't see the point in using it.


