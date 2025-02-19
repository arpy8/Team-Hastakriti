# Client Mobile Application

This repository contains the mobile application designed to provide a seamless user experience. This app is built using Expo and React Native to ensure smooth cross-platform functionality.

[![GitHub Downloads (specific asset, latest release)](https://img.shields.io/github/downloads-pre/epicshi/mobile-app-client/latest/drishti_v0.0.1_pre_release.apk)](https://github.com/EpicShi/mobile-app-client/releases)


---

## Prerequisites
Ensure you have the following installed:
- **Node.js**: [Download Node.js](https://nodejs.org/)
- **Expo CLI**: Install it globally using npm

```bash
npm install -g expo-cli
```
- **Android Studio** (for Android Emulator) or **Xcode** (for iOS Simulator) if testing on an emulator.

---

## Setup

1. **Clone the Repository**

```bash
cd mobile-app-client
```

2. **Install npm Dependencies**

```bash
npm install
```

3. **Start the Development Server**

```bash
npx expo start
```

4. **Launch on a Device/Emulator**
   - Scan the QR code using the Expo Go app (available on Google Play Store or Apple App Store).
   - Alternatively, press `a` to open the app on an Android emulator or `i` for iOS simulator.

---

## Directory Structure

```
mobile-app-client/
├── app/                          # Application logic
├── assets/                       # Static assets (images, fonts, etc.)
├── components/                   # Reusable UI components
├── constants/                    # Configuration constants
├── .gitignore                    # Git ignore rules
├── .npmrc                        # NPM configuration
├── app.json                      # Expo configuration
├── babel.config.js               # Babel configuration
├── eas.json                      # Expo Application Services (EAS) configuration
├── global.css                    # Global styles
├── gluestack-ui.config.json      # GlueStack UI configuration
├── metro.config.js               # Metro bundler configuration
├── nativewind-env.d.ts           # NativeWind environment type definitions
├── package-lock.json             # NPM package lock file
├── package.json                  # Project dependencies and scripts
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
```

---

## Screenshots

| Home Page | Dashboard | Govt. Schemes | News | Account |
|-|-|-|-|-|
| ![image](https://github.com/user-attachments/assets/6a8b449b-cfe5-4988-99c2-adebfab60f5d) | ![image](https://github.com/user-attachments/assets/1793218f-e823-4161-b60f-7a5af4809109) | ![image](https://github.com/user-attachments/assets/f810ae7e-5c23-4b44-a004-633e758a870e) | ![image](https://github.com/user-attachments/assets/172497b5-f5ac-42af-bd0d-186d1678ab58) | ![image](https://github.com/user-attachments/assets/11b642db-1536-4c35-b3c2-8e9748d5ad2a)
