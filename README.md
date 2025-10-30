# FoodOrdering

This project is a React Native app built with Expo.

## Getting Started

To run the project locally, follow these steps:

1. **Start an Emulator**

   - Launch an Android or iOS emulator on your machine.
   - For Android, you can use Android Studio's AVD Manager.
   - For iOS, use Xcode's Simulator.

2. **Start the Development Server**

   Open a terminal in the project root and run:

   ```sh
   npm run start
   ```

   This will start the Expo development server.

3. **Run the App on the Emulator**

   - With the Android emulator running, press the `a` key in the terminal where the Expo server is running.
   - For iOS, press the `i` key.

   The app will be installed and launched on your emulator.

## Additional Scripts

- `npm run android` - Start the project directly on Android emulator.
- `npm run ios` - Start the project directly on iOS simulator.
- `npm run web` - Run the project in your web browser.

## Requirements

- Node.js and npm installed
- Expo CLI installed globally (`npm install -g expo-cli`)
- Android Studio (for Android) or Xcode (for iOS)

## Auto Generation Typescript types

in order to generate typescript types from the supabase DB execute the following commands:

   - npx supabase login
   - npx supabase gen types typescript --project-id jfbjrrsrlhrcryrfsdnw > src/database.types.ts
