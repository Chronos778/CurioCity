import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../hooks/useAppTheme';
import { LocationService } from '../services/LocationService';
import LocationSearchModal from '../components/LocationSearchModal';

// Import new components
import Header from '../components/home/Header';
import CityInfoCard from '../components/home/CityInfoCard';
import CategoryFilter from '../components/home/CategoryFilter';
import PlacesToVisit from '../components/home/PlacesToVisit';
import LocalRestaurants from '../components/home/LocalRestaurants';
import NearbyAccommodation from '../components/home/NearbyAccommodation';
import HolyPlaces from '../components/home/HolyPlaces';
import ServicesList from '../components/home/ServicesList';
import LatestNews from '../components/home/LatestNews';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============ MOCK DATA ============
const MOCK_DATA = {
  placesToVisit: [
    { name: 'Central Park', type: 'park', coordinates: { latitude: 40.7829, longitude: -73.9654 }, distance: 1200, rating: 4.8 },
    { name: 'Times Square', type: 'landmark', coordinates: { latitude: 40.758, longitude: -73.9855 }, distance: 800, rating: 4.5 },
    { name: 'Empire State Building', type: 'historic', coordinates: { latitude: 40.7484, longitude: -73.9857 }, distance: 1500, rating: 4.7 },
    { name: 'Brooklyn Bridge', type: 'bridge', coordinates: { latitude: 40.7061, longitude: -73.9969 }, distance: 3200, rating: 4.9 },
    { name: 'Statue of Liberty', type: 'monument', coordinates: { latitude: 40.6892, longitude: -74.0445 }, distance: 8500, rating: 4.8 },
    { name: 'Metropolitan Museum', type: 'museum', coordinates: { latitude: 40.7794, longitude: -73.9632 }, distance: 2100, rating: 4.9 },
    { name: 'High Line Park', type: 'park', coordinates: { latitude: 40.748, longitude: -74.0048 }, distance: 2800, rating: 4.6 },
  ],
  restaurants: [
    { name: 'The Modern', categories: ['Fine Dining', 'American'], address: '9 W 53rd St', rating: 4.7, distance: 900 },
    { name: 'Katz Delicatessen', categories: ['Deli', 'Jewish'], address: '205 E Houston St', rating: 4.5, distance: 2200 },
    { name: 'Le Bernardin', categories: ['French', 'Seafood'], address: '155 W 51st St', rating: 4.9, distance: 1100 },
    { name: 'Shake Shack', categories: ['Burgers', 'Fast Casual'], address: 'Madison Square Park', rating: 4.3, distance: 1800 },
    { name: 'Joe Pizza', categories: ['Pizza', 'Italian'], address: '7 Carmine St', rating: 4.6, distance: 3100 },
    { name: 'Momofuku Noodle Bar', categories: ['Asian', 'Ramen'], address: '171 1st Ave', rating: 4.4, distance: 2500 },
    { name: 'Eleven Madison Park', categories: ['Fine Dining'], address: '11 Madison Ave', rating: 4.8, distance: 1600 },
  ],
  accommodation: [
    { name: 'The Plaza Hotel', type: 'Luxury Hotel', rating: 4.8, priceRange: '$$$$', amenities: ['Spa', 'Pool', 'Restaurant'], distance: 1000 },
    { name: 'Park Hyatt', type: 'Luxury Hotel', rating: 4.7, priceRange: '$$$$', amenities: ['Spa', 'Gym', 'Bar'], distance: 1200 },
    { name: 'The Standard', type: 'Boutique Hotel', rating: 4.5, priceRange: '$$$', amenities: ['Rooftop', 'Restaurant'], distance: 2800 },
    { name: 'Pod Times Square', type: 'Budget Hotel', rating: 4.2, priceRange: '$$', amenities: ['WiFi', 'Cafe'], distance: 600 },
    { name: 'Ace Hotel', type: 'Boutique Hotel', rating: 4.4, priceRange: '$$$', amenities: ['Restaurant', 'Bar', 'Workspace'], distance: 1500 },
    { name: 'YOTEL', type: 'Modern Hotel', rating: 4.3, priceRange: '$$', amenities: ['Robot Luggage', 'Gym'], distance: 700 },
  ],
  holyPlaces: [
    { name: 'St. Patrick Cathedral', religion: 'christian', type: 'cathedral', coordinates: { latitude: 40.7585, longitude: -73.9766 } },
    { name: 'Temple Emanu-El', religion: 'jewish', type: 'synagogue', coordinates: { latitude: 40.7694, longitude: -73.9634 } },
    { name: 'Islamic Cultural Center', religion: 'muslim', type: 'mosque', coordinates: { latitude: 40.7831, longitude: -73.9576 } },
    { name: 'Trinity Church', religion: 'christian', type: 'church', coordinates: { latitude: 40.7081, longitude: -74.0125 } },
    { name: 'Hindu Temple Society', religion: 'hindu', type: 'temple', coordinates: { latitude: 40.7282, longitude: -73.8259 } },
  ],
  services: [
    { name: 'City Gym 24/7', type: 'gym', distance: 400 },
    { name: 'Central Pharmacy', type: 'pharmacy', distance: 250 },
    { name: 'Quick Mart', type: 'convenience_store', distance: 150 },
    { name: 'Chase Bank ATM', type: 'bank', distance: 300 },
    { name: 'Post Office', type: 'post_office', distance: 600 },
    { name: 'City Library', type: 'library', distance: 800 },
    { name: 'Metro Hospital', type: 'hospital', distance: 1200 },
    { name: 'Fire Station', type: 'fire_station', distance: 900 },
    { name: 'Police Precinct', type: 'police', distance: 700 },
    { name: 'Community Center', type: 'community', distance: 500 },
    { name: 'Municipal Court', type: 'government', distance: 1500 },
    { name: 'Public Pool', type: 'recreation', distance: 1100 },
    { name: 'DMV Office', type: 'government', distance: 2000 },
    { name: 'Senior Center', type: 'community', distance: 650 },
    { name: 'Youth Center', type: 'community', distance: 750 },
    { name: 'Recycling Center', type: 'utility', distance: 1800 },
    { name: 'Car Wash', type: 'service', distance: 450 },
    { name: 'Laundromat', type: 'service', distance: 200 },
  ],
  news: [
    { title: 'New Subway Line Opens Next Month', description: 'The long-awaited extension will connect more neighborhoods to downtown.', source: 'City News', publishedAt: '2025-12-02' },
    { title: 'Local Festival This Weekend', description: 'Annual street fair returns with food vendors and live music.', source: 'Events Weekly', publishedAt: '2025-12-01' },
    { title: 'Restaurant Week Begins', description: 'Over 400 restaurants offering special prix-fixe menus through the month.', source: 'Food & Dining', publishedAt: '2025-11-30' },
    { title: 'Park Renovations Complete', description: 'New playgrounds and walking paths now open to the public.', source: 'Parks Dept', publishedAt: '2025-11-29' },
    { title: 'Weather Alert: Snow Expected', description: 'First major snowfall of the season predicted for this weekend.', source: 'Weather Center', publishedAt: '2025-11-28' },
  ],
};

const HomeScreen = ({ navigation }) => {
  const { colors } = useAppTheme();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Helper to sort by rating (highest first) and center the best item
  const sortByRating = (data) => {
    if (!data || data.length === 0) return [];
    const sorted = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sorted.length >= 3) {
      const middle = Math.floor(sorted.length / 2);
      const highestRated = sorted.shift();
      sorted.splice(middle, 0, highestRated);
    }
    return sorted;
  };

  // Use mock data sorted by rating
  const placesToVisit = sortByRating(MOCK_DATA.placesToVisit);
  const restaurants = sortByRating(MOCK_DATA.restaurants);
  const accommodation = sortByRating(MOCK_DATA.accommodation);
  const holyPlaces = MOCK_DATA.holyPlaces;
  const services = MOCK_DATA.services;
  const news = MOCK_DATA.news;

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    setIsLoading(true);
    try {
      const coords = await LocationService.getCurrentLocation();
      const locationDetails = await LocationService.getLocationDetails(
        coords.latitude,
        coords.longitude
      );
      
      if (locationDetails) {
        setCurrentLocation(locationDetails);
      } else {
        const defaultLocation = await LocationService.getDefaultLocationWithWikipedia();
        setCurrentLocation(defaultLocation);
      }
    } catch (error) {
      console.log('Location not available, using default location');
      try {
        const defaultLocation = await LocationService.getDefaultLocationWithWikipedia();
        setCurrentLocation(defaultLocation);
      } catch (fallbackError) {
        console.error('Error loading default location:', fallbackError);
        setCurrentLocation({
          name: 'New York',
          region: 'New York',
          country: 'United States',
          formattedAddress: 'New York, NY, USA',
          coordinates: { latitude: 40.7128, longitude: -74.0060 },
          description: 'New York City is the most populous city in the United States, known for its iconic skyline, diverse culture, and world-famous landmarks.',
          history: 'New York City has a rich history spanning over 400 years, from its origins as a Dutch trading post to becoming one of the world\'s most influential cities.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    setCurrentLocation(location);
  };

  const navigateTo = (screen, params = {}) => {
    navigation.navigate(screen, { location: currentLocation, ...params });
  };

  const handleCategorySelect = (category) => {
    switch(category) {
        case 'Hotels':
            navigateTo('AccommodationDetail');
            break;
        case 'Restaurants':
            navigateTo('RestaurantsDetail');
            break;
        case 'Services':
            navigateTo('ServicesDetail');
            break;
        case 'News':
            navigateTo('NewsDetail');
            break;
        case 'Holy Places':
            navigateTo('HolyPlacesDetail');
            break;
        default:
            break;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-4 text-base" style={{ color: colors.textSecondary }}>
            Getting your location...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <Header 
        cityName={currentLocation?.name || 'Select City'} 
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <CityInfoCard 
            description={currentLocation?.description}
            onReadMore={() => navigateTo('LocationDetail')}
            onSearch={() => setShowSearchModal(true)}
        />

        <CategoryFilter onCategorySelect={handleCategorySelect} />

        <PlacesToVisit 
            data={placesToVisit} 
            onItemPress={(item) => navigateTo('PlacesDetail', { item })}
        />

        <LocalRestaurants 
            data={restaurants} 
            onItemPress={(item) => navigateTo('RestaurantsDetail', { item })}
        />

        <NearbyAccommodation 
            data={accommodation} 
            onItemPress={(item) => navigateTo('AccommodationDetail', { item })}
            onViewMore={() => navigateTo('AccommodationDetail')}
        />

        <HolyPlaces 
            data={holyPlaces} 
            onItemPress={(item) => navigateTo('HolyPlacesDetail', { item })}
        />

        <ServicesList 
            data={services} 
            onItemPress={(item) => navigateTo('ServicesDetail', { item })}
        />

        <LatestNews 
            data={news} 
            onItemPress={(item) => navigateTo('NewsDetail', { item })}
        />
      </ScrollView>

      <LocationSearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onLocationSelect={handleLocationSelect}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
