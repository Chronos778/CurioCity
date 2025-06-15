import { useTheme } from '../context/ThemeContext';
import { LIGHT_THEME, DARK_THEME } from '../constants/colors';

export const useAppTheme = () => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  
  const colors = isDarkMode ? DARK_THEME : LIGHT_THEME;
  
  return {
    isDarkMode,
    toggleTheme,
    theme,
    colors,
  };
};
