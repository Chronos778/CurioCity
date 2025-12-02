# CurioCity - Location Discovery Mobile App

A React Native Expo mobile application for discovering comprehensive location-based information including places to visit, restaurants, news, accommodation, services, and more.

## 🚀 Features

- **Location Discovery**: GPS-based location detection with comprehensive data
- **Multiple Data Sources**: Integration with 7+ live APIs for rich content
- **Real-time Information**: News, weather, places, restaurants, and services
- **Modern UI**: Beautiful gradient-based design with dark/light theme support
- **Cross-platform**: Works on both iOS and Android devices
- **Offline Fallback**: Graceful handling when location services are unavailable

## 📱 Screenshots

The app provides detailed information about any location including:
- Local news articles
- Tourist attractions and places to visit
- Restaurant recommendations
- Accommodation options
- Holy places and cultural sites
- Local services and amenities
- Historical information

## 🛠 Technology Stack

- **Framework**: React Native 0.81.5 with Expo 54.0.25
- **Navigation**: React Navigation 7.1.10
- **React Version**: 19.1.0
- **State Management**: React Hooks
- **Styling**: StyleSheet with dynamic theming
- **APIs**: Multiple live APIs for comprehensive data
- **Location Services**: Expo Location 19.0.7
- **Permissions**: Graceful location permission handling
- **UI Components**: Expo Vector Icons 15.0.3, Expo Linear Gradient 15.0.7
- **Storage**: AsyncStorage 2.2.0
- **Dev Tools**: Babel 7.20.0, react-native-dotenv 3.4.11

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator or physical device

## 🔒 Security

**Important**: This project uses environment variables to store API keys securely. Never commit your `.env` file to version control.

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd curiocity
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` file and add your API keys:
- Get NewsData.io API key from https://newsdata.io/
- Get OpenTripMap API key from https://opentripmap.io/
- Get Foursquare API key from https://developer.foursquare.com/
- Get Google Gemini API key from https://ai.google.dev/

## 📱 Running the App

### Option 1: Expo Go (Recommended for development)
Run the app instantly on your phone without building an APK:

```bash
npm start
```
- Scan the QR code with **Expo Go** app (download from Play Store/App Store)
- Make sure your phone and PC are on the **same WiFi network**
- If QR scan fails, try: `npx expo start --tunnel`

### Option 2: Android Emulator
```bash
npm start
# Press 'a' to open in Android Emulator
```

### Option 3: iOS Simulator (macOS only)
```bash
npm start
# Press 'i' to open in iOS Simulator
```

## 📦 Building APK

### Preview APK (for testing)
```bash
# Login to Expo (one-time)
eas login

# Build preview APK
npm run build:android
```

### Production APK (for distribution)
```bash
npm run build:android:production
```

### Development Build APK (with dev tools)
If you need a development build with expo-dev-client:
```bash
# First install expo-dev-client
npx expo install expo-dev-client

# Build development APK
npm run build:android:development
```
After installing the development build APK, run `npx expo start` and the app will connect to the bundler.

## 🗂 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── LocationSearchModal.js
├── constants/          # App constants (colors, sizes)
│   └── colors.js
├── context/           # React context providers
│   └── ThemeContext.js
├── hooks/             # Custom React hooks
│   └── useAppTheme.js
├── screens/           # Main application screens
│   ├── HomeScreen.js
│   ├── LocationDetailScreen.js
│   ├── NewsDetailScreen.js
│   ├── RestaurantsDetailScreen.js
│   ├── PlacesDetailScreen.js
│   ├── HolyPlacesDetailScreen.js
│   ├── AccommodationDetailScreen.js
│   ├── ServicesDetailScreen.js
│   └── HistoryDetailScreen.js
└── services/          # API services and business logic
    └── LocationService.js
```

## 🌐 API Integrations

- **NewsData.io**: Local news articles
- **OpenTripMap**: Tourist attractions and cultural sites
- **Foursquare**: Restaurant and venue data
- **Wikipedia**: Location descriptions and historical data
- **Google Gemini AI**: Enhanced content generation
- **OpenStreetMap Nominatim**: Location search and geocoding
- **Overpass API**: Religious and cultural sites

## 🎨 Design Features

- **Modern UI**: Gradient backgrounds and card-based layouts
- **Dark/Light Theme**: Automatic theme switching
- **Responsive Design**: Optimized for different screen sizes
- **Accessibility**: Proper contrast ratios and readable fonts
- **Smooth Animations**: Enhanced user experience

## 📱 How to Use

1. **Launch App**: Open CurioCity on your device
2. **Location Permission**: Grant location access when prompted
3. **Explore Data**: Browse through different sections (News, Places, Restaurants, etc.)
4. **Search Locations**: Use the search function to explore any location worldwide
5. **View Details**: Tap on any item to see detailed information

## 🔧 Configuration

The app includes fallback mechanisms:
- Default location (New York) when GPS is unavailable
- Graceful API error handling
- Offline-friendly design

## 📄 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

This is a demonstration project showcasing React Native development skills and API integration capabilities.

## 📞 Support

For questions or issues, please refer to the Expo documentation or React Native community resources.
