import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';

// Import theme provider and hook
import { ThemeProvider } from './src/context/ThemeContext';
import { useAppTheme } from './src/hooks/useAppTheme';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import LocationDetailScreen from './src/screens/LocationDetailScreen';
import NewsDetailScreen from './src/screens/NewsDetailScreen';
import RestaurantsDetailScreen from './src/screens/RestaurantsDetailScreen';
import PlacesDetailScreen from './src/screens/PlacesDetailScreen';
import HolyPlacesDetailScreen from './src/screens/HolyPlacesDetailScreen';
import AccommodationDetailScreen from './src/screens/AccommodationDetailScreen';
import ServicesDetailScreen from './src/screens/ServicesDetailScreen';
import HistoryDetailScreen from './src/screens/HistoryDetailScreen';

const Stack = createStackNavigator();

// Create the app content component that uses theme
function AppContent() {
  const { colors, isDarkMode } = useAppTheme();
  
  return (
    <NavigationContainer>
      <StatusBar style={isDarkMode ? "light" : "dark"} backgroundColor={colors.background} />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'CurioCity',
          }}
        />
        <Stack.Screen 
          name="LocationDetail" 
          component={LocationDetailScreen}
          options={{
            title: 'Location Details',
          }}
        />
        <Stack.Screen 
          name="NewsDetail" 
          component={NewsDetailScreen}
          options={{
            title: 'Local News',
          }}
        />
        <Stack.Screen 
          name="RestaurantsDetail" 
          component={RestaurantsDetailScreen}
          options={{
            title: 'Restaurants',
          }}
        />
        <Stack.Screen 
          name="PlacesDetail" 
          component={PlacesDetailScreen}
          options={{
            title: 'Places to Visit',
          }}
        />
        <Stack.Screen 
          name="HolyPlacesDetail" 
          component={HolyPlacesDetailScreen}
          options={{
            title: 'Holy Places',
          }}
        />
        <Stack.Screen 
          name="AccommodationDetail" 
          component={AccommodationDetailScreen}
          options={{
            title: 'Accommodation',
          }}
        />
        <Stack.Screen 
          name="ServicesDetail" 
          component={ServicesDetailScreen}
          options={{
            title: 'Services & Amenities',
          }}
        />
        <Stack.Screen 
          name="HistoryDetail" 
          component={HistoryDetailScreen}
          options={{
            title: 'History & Culture',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
