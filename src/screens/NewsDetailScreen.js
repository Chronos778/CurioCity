import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/colors';
import { useAppTheme } from '../hooks/useAppTheme';

const NewsDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const { colors, isDarkMode } = useAppTheme();
  const news = location.news || [];

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNewsLink = async (url) => {
    if (url) {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        }
      } catch (error) {
        console.error('Error opening news link:', error);
      }
    }
  };
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Recent';
    }
  };

  const renderNewsItem = ({ item: article, index }) => (
    <TouchableOpacity
      className="mb-4 rounded-xl overflow-hidden flex-row p-3"
      style={{ backgroundColor: colors.cardBackground }}
      onPress={() => handleNewsLink(article.url)}
      activeOpacity={0.7}
    >
      {article.imageUrl ? (
        <Image
          source={{ uri: article.imageUrl }}
          className="w-24 h-24 rounded-lg"
          resizeMode="cover"
        />
      ) : (
        <View className="w-24 h-24 rounded-lg items-center justify-center" style={{ backgroundColor: colors.border }}>
          <Ionicons 
            name="newspaper-outline" 
            size={24} 
            color={colors.textSecondary} 
          />
        </View>
      )}
      <View className="flex-1 ml-3">
        <Text className="text-base font-semibold mb-1" numberOfLines={2} style={{ color: colors.textPrimary }}>
          {article.title}
        </Text>
        <Text className="text-sm mb-2" numberOfLines={3} style={{ color: colors.textSecondary }}>
          {article.description}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-medium" style={{ color: colors.textSecondary }}>{article.source}</Text>
          <Text className="text-xs" style={{ color: colors.textSecondary }}>{formatDate(article.publishedAt)}</Text>
        </View>
      </View>
      <Ionicons name="open-outline" size={SIZES.iconSmall} color={colors.primary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        className="flex-row items-center px-4 py-3 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <TouchableOpacity
          className="p-2"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-semibold text-center" style={{ color: colors.textWhite }}>Latest News</Text>
        <View className="p-2">
          <Ionicons name="newspaper" size={24} color={colors.textWhite} />
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row mx-4 my-4 p-4 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{news.length}</Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Articles Found</Text>
          </View>
          <View className="w-px mx-4" style={{ backgroundColor: colors.border }} />
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {news.filter(article => article.publishedAt && new Date(article.publishedAt) > new Date(Date.now() - 24*60*60*1000)).length}
            </Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Today's News</Text>
          </View>
          <View className="w-px mx-4" style={{ backgroundColor: colors.border }} />
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {news.filter(article => article.source).length}
            </Text>
            <Text className="text-xs mt-1 text-center" style={{ color: colors.textSecondary }}>Sources</Text>
          </View>
        </View>

        {news.length > 0 ? (
          <>            <View className="px-4 mb-3">
              <Text className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>Latest News</Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>Recent articles and updates from {location.name}</Text>
            </View>
              <View className="px-4">
              <FlatList
              data={news}
              renderItem={renderNewsItem}
              keyExtractor={(item, index) => `news-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
            </View>
          </>
        ) : (
          <View className="flex-1 items-center justify-center px-8 py-16">
            <Ionicons name="newspaper-outline" size={60} color={colors.textSecondary} />
            <Text className="text-xl font-bold mt-4 text-center" style={{ color: colors.textPrimary }}>No News Available</Text>
            <Text className="text-sm mt-2 text-center" style={{ color: colors.textSecondary }}>
              We couldn't find any recent news for {location.name}. Try checking back later.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewsDetailScreen;
