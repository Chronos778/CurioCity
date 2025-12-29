import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';
import { LocationService } from '../services/LocationService';
import LocationSearchModal from '../components/LocationSearchModal';

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
  ],
  news: [
    { title: 'New Subway Line Opens Next Month', description: 'The long-awaited extension will connect more neighborhoods to downtown.', source: 'City News', publishedAt: '2025-12-02' },
    { title: 'Local Festival This Weekend', description: 'Annual street fair returns with food vendors and live music.', source: 'Events Weekly', publishedAt: '2025-12-01' },
    { title: 'Restaurant Week Begins', description: 'Over 400 restaurants offering special prix-fixe menus through the month.', source: 'Food & Dining', publishedAt: '2025-11-30' },
    { title: 'Park Renovations Complete', description: 'New playgrounds and walking paths now open to the public.', source: 'Parks Dept', publishedAt: '2025-11-29' },
    { title: 'Weather Alert: Snow Expected', description: 'First major snowfall of the season predicted for this weekend.', source: 'Weather Center', publishedAt: '2025-11-28' },
  ],
};

// Section color constants
const SECTION_COLORS = {
  places: '#FF6B6B',
  restaurants: '#4ECDC4',
  accommodation: '#DDA0DD',
  holyPlaces: '#96CEB4',
  services: '#45B7D1',
  news: '#FFEAA7',
  history: '#9B59B6',
};

const HomeScreen = ({ navigation }) => {
  const { colors, isDarkMode, toggleTheme } = useAppTheme();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  // Scroll tracking for carousel indicators
  const [activePlaceIndex, setActivePlaceIndex] = useState(0);
  const [activeRestaurantIndex, setActiveRestaurantIndex] = useState(0);
  const [activeHolyPlaceIndex, setActiveHolyPlaceIndex] = useState(0);

  // Refs for FlatLists to scroll to center on mount
  const placesListRef = useRef(null);
  const restaurantsListRef = useRef(null);
  const holyPlacesListRef = useRef(null);

  // Card dimensions for FlatList snap
  const CARD_WIDTH = SCREEN_WIDTH * 0.75;
  const SNAP_INTERVAL = CARD_WIDTH + 16;

  // Get middle index for centering highest rated
  const getMiddleIndex = (length) => Math.floor(length / 2);

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

  // Scroll to center after component mounts
  useEffect(() => {
    if (!isLoading) {
      const scrollTimeout = setTimeout(() => {
        const placesMiddle = getMiddleIndex(Math.min(placesToVisit.length, 7));
        const restaurantsMiddle = getMiddleIndex(Math.min(restaurants.length, 7));
        const holyMiddle = getMiddleIndex(Math.min(holyPlaces.length, 5));

        if (placesListRef.current && placesToVisit.length > 0) {
          placesListRef.current.scrollToOffset({ offset: placesMiddle * SNAP_INTERVAL, animated: false });
          setActivePlaceIndex(placesMiddle);
        }
        if (restaurantsListRef.current && restaurants.length > 0) {
          restaurantsListRef.current.scrollToOffset({ offset: restaurantsMiddle * SNAP_INTERVAL, animated: false });
          setActiveRestaurantIndex(restaurantsMiddle);
        }
        if (holyPlacesListRef.current && holyPlaces.length > 0) {
          holyPlacesListRef.current.scrollToOffset({ offset: holyMiddle * SNAP_INTERVAL, animated: false });
          setActiveHolyPlaceIndex(holyMiddle);
        }
      }, 100);
      return () => clearTimeout(scrollTimeout);
    }
  }, [isLoading]);

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

  const getFirstSentence = (text) => {
    if (!text) return '';
    const sentences = text.split(/[.!?]+/);
    return sentences[0] + (sentences[0] ? '.' : '');
  };

  const handleLocationSelect = (location) => {
    setCurrentLocation(location);
  };

  const navigateTo = (screen, params = {}) => {
    navigation.navigate(screen, { location: currentLocation, ...params });
  };

  // Scroll handlers for carousel indicators
  const handlePlaceScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / SNAP_INTERVAL);
    setActivePlaceIndex(Math.max(0, Math.min(index, placesToVisit.length - 1)));
  };

  const handleRestaurantScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / SNAP_INTERVAL);
    setActiveRestaurantIndex(Math.max(0, Math.min(index, restaurants.length - 1)));
  };

  const handleHolyPlaceScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / SNAP_INTERVAL);
    setActiveHolyPlaceIndex(Math.max(0, Math.min(index, holyPlaces.length - 1)));
  };

  // Render scroll indicators for carousels
  const renderScrollIndicators = (totalItems, activeIndex) => (
    <View className="flex-row justify-center items-center py-2">
      {Array.from({ length: totalItems }).map((_, index) => (
        <View
          key={`dot-${index}`}
          className={`w-2 h-2 rounded-full mx-1 ${
            activeIndex === index ? 'bg-blue-500 w-6' : 'bg-gray-400 dark:bg-gray-600'
          }`}
        />
      ))}
    </View>
  );

  // ============ RENDER FUNCTIONS ============

  const renderPlaceCard = ({ item }) => (
    <TouchableOpacity
      className="mr-4"
      style={{ width: CARD_WIDTH }}
      onPress={() => navigateTo('PlacesDetail')}
      activeOpacity={0.9}
    >
      <View className="rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700" style={{ backgroundColor: colors.cardBackground }}>
        <View className="items-center justify-center py-12" style={{ backgroundColor: SECTION_COLORS.places }}>
          <Ionicons name="camera" size={56} color="#FFF" />
          {item.rating && (
            <View className="absolute top-3 right-3 flex-row items-center bg-white rounded-full px-2 py-1">
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text className="text-xs font-semibold ml-1">{item.rating}</Text>
            </View>
          )}
        </View>
        <View className="p-4">
          <Text className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }} numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-sm mb-2" style={{ color: colors.textSecondary }} numberOfLines={1}>
            {item.distance ? `${(item.distance / 1000).toFixed(1)} km away` : item.type}
          </Text>
          <Text className="text-sm font-medium" style={{ color: colors.primary }}>
            View Details
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRestaurantCard = ({ item }) => (
    <TouchableOpacity
      className="mr-4"
      style={{ width: CARD_WIDTH }}
      onPress={() => navigateTo('RestaurantsDetail')}
      activeOpacity={0.9}
    >
      <View className="rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700" style={{ backgroundColor: colors.cardBackground }}>
        <View className="items-center justify-center py-12" style={{ backgroundColor: SECTION_COLORS.restaurants }}>
          <Ionicons name="restaurant" size={56} color="#FFF" />
          {item.rating && (
            <View className="absolute top-3 right-3 flex-row items-center bg-white rounded-full px-2 py-1">
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text className="text-xs font-semibold ml-1">{item.rating}</Text>
            </View>
          )}
        </View>
        <View className="p-4">
          <Text className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }} numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-sm mb-3" style={{ color: colors.textSecondary }} numberOfLines={1}>
            {item.categories?.join(' | ') || item.address}
          </Text>
          <View className="flex-row gap-2">
            <View className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg py-2 items-center">
              <Text className="text-xs font-medium" style={{ color: colors.textPrimary }}>Details</Text>
            </View>
            <View className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg py-2 items-center">
              <Text className="text-xs font-medium" style={{ color: colors.textPrimary }}>View Menu</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAccommodationCard = (item, index) => (
    <TouchableOpacity
      key={`accommodation-${index}`}
      className="mb-3"
      style={{ width: (SCREEN_WIDTH - 48) / 2 }}
      onPress={() => navigateTo('AccommodationDetail')}
      activeOpacity={0.9}
    >
      <View className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700" style={{ backgroundColor: colors.cardBackground }}>
        <View className="items-center justify-center py-16 relative" style={{ backgroundColor: SECTION_COLORS.accommodation }}>
          <Ionicons name="bed" size={64} color="#FFF" />
          <TouchableOpacity className="absolute top-2 right-2 p-1" activeOpacity={0.7}>
            <Ionicons name="bookmark-outline" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <View className="p-3">
          <Text className="text-sm font-bold mb-2" style={{ color: colors.textPrimary }} numberOfLines={2}>
            {item.name}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-xs font-semibold" style={{ color: colors.primary }}>{item.priceRange}</Text>
            <Text className="text-xs mx-2" style={{ color: colors.textSecondary }}>|</Text>
            <Text className="text-xs flex-1" style={{ color: colors.textSecondary }} numberOfLines={1}>{item.type}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHolyPlaceCard = ({ item }) => (
    <TouchableOpacity
      className="mr-4"
      style={{ width: CARD_WIDTH }}
      onPress={() => navigateTo('HolyPlacesDetail')}
      activeOpacity={0.9}
    >
      <View className="rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700" style={{ backgroundColor: colors.cardBackground }}>
        <View className="items-center justify-center py-16" style={{ backgroundColor: SECTION_COLORS.holyPlaces }}>
          <Ionicons name="flower" size={64} color="#FFF" />
        </View>
        <View className="p-4">
          <Text className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }} numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            {item.type} | {item.religion}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
      {/* ============ COMPACT HEADER ============ */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b" style={{ borderBottomColor: colors.border }}>
        <TouchableOpacity
          className="flex-row items-center flex-1"
          onPress={() => setShowSearchModal(true)}
        >
          <Ionicons name="location-outline" size={24} color={colors.primary} />
          <Text className="text-xl font-bold ml-2" style={{ color: colors.textPrimary }}>
            {currentLocation?.name || 'Select City'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="w-10 h-10 rounded-full items-center justify-center border" 
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
          onPress={toggleTheme}
        >
          <Ionicons
            name={isDarkMode ? 'sunny' : 'moon'}
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* ============ CITY INFO CARD ============ */}
        <View className="mx-4 my-6 rounded-2xl border p-6" 
          style={{ 
            backgroundColor: colors.cardBackground, 
            borderColor: colors.border,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDarkMode ? 0.4 : 0.15,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text className="text-base mb-6 leading-6" style={{ color: colors.textSecondary }}>
            {getFirstSentence(currentLocation?.description) || 'Discover amazing places around you.'}
          </Text>
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              className="flex-row items-center px-6 py-3 rounded-lg"
              style={{ backgroundColor: isDarkMode ? colors.surface : '#1a1a1a' }}
              onPress={() => navigateTo('LocationDetail')}
            >
              <Text className="text-white font-medium mr-2">read more</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.cardBackground }}
              onPress={() => setShowSearchModal(true)}
            >
              <Ionicons name="search" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chip Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          contentContainerClassName="px-4"
        >
          <TouchableOpacity 
            className="flex-row items-center rounded-full px-4 py-2 mr-3 border" 
            style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
            onPress={() => navigateTo('HistoryDetail')}
          >
            <Ionicons name="library-outline" size={16} color={SECTION_COLORS.history} />
            <Text className="ml-2 text-sm font-medium" style={{ color: colors.textPrimary }}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-row items-center rounded-full px-4 py-2 mr-3 border" 
            style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
            onPress={() => navigateTo('RestaurantsDetail')}
          >
            <Ionicons name="restaurant-outline" size={16} color={SECTION_COLORS.restaurants} />
            <Text className="ml-2 text-sm font-medium" style={{ color: colors.textPrimary }}>Restaurants</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-row items-center rounded-full px-4 py-2 border" 
            style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
            onPress={() => navigateTo('ServicesDetail')}
          >
            <Ionicons name="business-outline" size={16} color={SECTION_COLORS.services} />
            <Text className="ml-2 text-sm font-medium" style={{ color: colors.textPrimary }}>Services</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ============ PLACES TO VISIT ============ */}
        {placesToVisit.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between px-4 mb-3">
              <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Places To Visit</Text>
              <TouchableOpacity onPress={() => navigateTo('PlacesDetail')}>
                <Text className="text-sm font-medium" style={{ color: colors.primary }}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              ref={placesListRef}
              data={placesToVisit.slice(0, 7)}
              renderItem={renderPlaceCard}
              keyExtractor={(item, index) => `place-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="px-4"
              snapToInterval={SNAP_INTERVAL}
              snapToAlignment="start"
              decelerationRate="fast"
              onScroll={handlePlaceScroll}
              scrollEventThrottle={16}
            />
            {renderScrollIndicators(Math.min(placesToVisit.length, 7), activePlaceIndex)}
          </View>
        )}

        {/* ============ LOCAL RESTAURANTS ============ */}
        {restaurants.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between px-4 mb-3">
              <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Local Restaurants</Text>
              <TouchableOpacity onPress={() => navigateTo('RestaurantsDetail')}>
                <Text className="text-sm font-medium" style={{ color: colors.primary }}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              ref={restaurantsListRef}
              data={restaurants.slice(0, 7)}
              renderItem={renderRestaurantCard}
              keyExtractor={(item, index) => `restaurant-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="px-4"
              snapToInterval={SNAP_INTERVAL}
              snapToAlignment="start"
              decelerationRate="fast"
              onScroll={handleRestaurantScroll}
              scrollEventThrottle={16}
            />
            {renderScrollIndicators(Math.min(restaurants.length, 7), activeRestaurantIndex)}
          </View>
        )}

        {/* ============ NEARBY ACCOMMODATION ============ */}
        {accommodation.length > 0 && (
          <View className="mb-6">
            <View className="px-4 mb-3">
              <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Nearby Accommodation</Text>
            </View>
            <View className="flex-row flex-wrap px-4 gap-3">
              {accommodation.slice(0, 4).map((item, index) => renderAccommodationCard(item, index))}
            </View>
          </View>
        )}

        {/* ============ HOLY PLACES ============ */}
        {holyPlaces.length > 0 && (
          <View className="mb-6">
            <View className="px-4 mb-3">
              <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Holy Places</Text>
            </View>
            <FlatList
              ref={holyPlacesListRef}
              data={holyPlaces.slice(0, 5)}
              renderItem={renderHolyPlaceCard}
              keyExtractor={(item, index) => `holy-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="px-4"
              snapToInterval={SNAP_INTERVAL}
              snapToAlignment="start"
              decelerationRate="fast"
              onScroll={handleHolyPlaceScroll}
              scrollEventThrottle={16}
            />
            {renderScrollIndicators(Math.min(holyPlaces.length, 5), activeHolyPlaceIndex)}
          </View>
        )}

        {/* ============ SERVICES AND AMENITIES ============ */}
        {services.length > 0 && (
          <View className="mb-6">
            <View className="px-4 mb-3">
              <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Services and Amenities</Text>
            </View>
            <View className="mx-4 rounded-2xl border overflow-hidden" 
              style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
            >
              {services.map((service, index) => (
                <TouchableOpacity
                  key={`service-${index}`}
                  className={`flex-row items-center p-4 ${index !== services.length - 1 ? 'border-b' : ''}`}
                  style={{ borderBottomColor: colors.border }}
                  onPress={() => navigateTo('ServicesDetail')}
                >
                  <View className="w-10 h-10 rounded-full items-center justify-center mr-3" 
                    style={{ backgroundColor: SECTION_COLORS.services + '20' }}
                  >
                    <Ionicons name="business" size={18} color={SECTION_COLORS.services} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium mb-1" style={{ color: colors.textPrimary }}>
                      {service.name}
                    </Text>
                    <Text className="text-xs" style={{ color: colors.primary }}>
                      call detail and review
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ============ LATEST NEWS IN AREA ============ */}
        {news.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between px-4 mb-3">
              <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Latest News in Area</Text>
              <TouchableOpacity onPress={() => navigateTo('NewsDetail')}>
                <Text className="text-sm font-medium" style={{ color: colors.primary }}>View All</Text>
              </TouchableOpacity>
            </View>
            <View className="mx-4 rounded-2xl border overflow-hidden" 
              style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
            >
              {news.map((item, index) => (
                <TouchableOpacity
                  key={`news-${index}`}
                  className={`flex-row p-4 ${index !== news.length - 1 ? 'border-b' : ''}`}
                  style={{ borderBottomColor: colors.border }}
                  onPress={() => navigateTo('NewsDetail')}
                  activeOpacity={0.7}
                >
                  <View className="w-16 h-16 rounded-xl items-center justify-center mr-3" 
                    style={{ backgroundColor: SECTION_COLORS.news }}
                  >
                    <Ionicons name="newspaper" size={36} color="#333" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold mb-1" style={{ color: colors.textPrimary }} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text className="text-sm" style={{ color: colors.textSecondary }} numberOfLines={2}>
                      {item.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Location Search Modal */}
      <LocationSearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onLocationSelect={handleLocationSelect}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
