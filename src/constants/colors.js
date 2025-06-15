// Dynamic theme colors
export const LIGHT_THEME = {
  // Primary colors
  primary: '#2596be',
  primaryDark: '#1e7a9b',
  primaryLight: '#4db3d1',
  secondary: '#4ECDC4',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundAccent: '#F1F3F4',
  lightBackground: '#FAFAFA',
  
  // Text colors
  textPrimary: '#1A1A1A',
  textSecondary: '#6C757D',
  textMuted: '#ADB5BD',
  textWhite: '#FFFFFF',
    // Accent colors
  accent: '#4ECDC4',
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  
  // Gradient colors
  gradientStart: '#2596be',
  gradientEnd: '#4ECDC4',
    // Card and border colors
  cardBackground: '#FFFFFF',
  borderLight: '#E0E4E7',
  border: '#D1D5DA',
  shadow: 'rgba(0, 0, 0, 0.08)',
};

export const DARK_THEME = {
  // Primary colors (keep vibrant for good contrast)
  primary: '#2596be',
  primaryDark: '#1e7a9b',
  primaryLight: '#4db3d1',
  secondary: '#4ECDC4',
  
  // Background colors
  background: '#121212',
  backgroundSecondary: '#1E1E1E',
  backgroundAccent: '#2A2A2A',
  lightBackground: '#1A1A1A',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#808080',
  textWhite: '#FFFFFF',
    // Accent colors
  accent: '#4ECDC4',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  
  // Gradient colors
  gradientStart: '#2596be',
  gradientEnd: '#4ECDC4',
  
  // Card and border colors
  cardBackground: '#1E1E1E',
  borderLight: '#333333',
  border: '#404040',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

// Legacy COLORS export for backward compatibility
export const COLORS = LIGHT_THEME;

export const SIZES = {
  // Font sizes
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,
  body: 16,
  caption: 15,
  small: 12,
  
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Border radius
  radiusSmall: 8,
  radiusMedium: 12,
  radiusLarge: 20,
  
  // Icon sizes
  iconSmall: 16,
  iconMedium: 24,
  iconLarge: 32,
};
