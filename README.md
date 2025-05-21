# Firebase with Expo (Native & Web)

This app shows how to use Firebase with Expo on both native and web.
It's a companion project for my blog and YouTube tutorials regarding firebase. 
Each chapter follows a lecture, and I'll update it as I release new content.
I have ideas for future chapters, but I'm open to [suggestions](https://github.com/amarjanica/firebase-expo-demo/discussions). Let me know what you'd like to see.

<img src="/repo-assets/demo.png" width="250" alt="Demo"/>

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

1. Getting started - configuring firebase for expo go, native and web. [Read my article](https://www.amarjanica.com/getting-started-with-firebase-on-expo-go-native-and-web/) or [watch Youtube](https://youtu.be/6uWL5hxK1NM)
2. Analytics - tracking user events. [Read my article](https://www.amarjanica.com/google-analytics-in-expo-firebase-setup-for-native-and-web) or [watch Youtube](https://youtu.be/U9HSJesbD9E)
3. Google login - [Read my article](https://www.amarjanica.com/making-google-login-work-in-react-native-and-web/) or [watch Youtube](https://youtu.be/RhnmFVDy2mQ)

### About Expo Go
In my earlier articles, I did support Expo Go, but I decided to remove it.
Personally, I don't use it, I use either native builds or bundled development client builds.
Expo Go doesn't support native modules, so I don't see the point in using it.
