# Firebase with Expo (Native & Web)

This app shows how to use Firebase with Expo on both native, expo go and web.
It's a companion to my blog and YouTube tutorials. Each chapter follows a lecture, and I'll update it as I release new content.
I have ideas for future chapters, but I'm open to [suggestions](https://github.com/amarjanica/firebase-expo-demo/discussions). Let me know what you'd like to see.

## Get started

- Obtain your Firebase config
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
    npx expo start
   ```


## Chapters

1. Getting started - configuring firebase for expo go, native and web. [Read my article](https://www.amarjanica.com/getting-started-with-firebase-on-expo-go-native-and-web/) or [watch Youtube](https://youtu.be/6uWL5hxK1NM)
2. Analytics - tracking user events.
