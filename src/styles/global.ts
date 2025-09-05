import { StyleSheet } from 'react-native';

// Global color scheme for the handwritten notes theme
export const colors = {
  // Primary colors
  primary: '#0066CC', // Blue
  primaryLight: '#F0F8FF',
  primaryBorder: '#1E90FF',
  
  // Secondary colors
  secondary: '#FF6B6B', // Red
  secondaryLight: '#FFE6E6',
  secondaryBorder: '#E53E3E',
  
  // Success colors
  success: '#32CD32', // Green
  successLight: '#F0FFF0',
  successBorder: '#228B22',
  
  // Warning colors
  warning: '#FFD700', // Yellow
  warningLight: '#FFF8DC',
  warningBorder: '#B8860B',
  
  // Info colors
  info: '#8B5CF6', // Purple
  infoLight: '#F8F7FF',
  infoBorder: '#6A0DAD',
  
  // Neutral colors
  paper: '#FEFEFE', // Cream paper background
  paperLight: '#F9F9F9',
  white: '#FFFFFF',
  
  // Text colors
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  
  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
};

// Global typography scale
export const typography = {
  // Font families
  fontFamily: {
    primary: 'Virgil',
    fallback: 'IndieFlower',
    system: 'System',
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 22,
    '3xl': 24,
    '4xl': 26,
    '5xl': 28,
    '6xl': 32,
    '7xl': 36,
  },
  
  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Line heights
  lineHeight: {
    tight: 20,
    normal: 24,
    relaxed: 28,
    loose: 32,
  },
};

// Global spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 60,
};

// Global border radius scale
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
};

// Global shadow styles
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
};

// Common component styles
export const commonStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  
  // Header styles
  header: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderBottomWidth: 3,
    borderBottomColor: colors.primaryBorder,
    borderStyle: 'dashed',
  },
  
  // Card styles
  card: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    ...shadows.lg,
  },
  
  // Button styles
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    ...shadows.md,
  },
  
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryBorder,
  },
  
  buttonSecondary: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  
  // Text styles
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  subtitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.relaxed,
  },
  
  bodyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal,
  },
  
  buttonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.extrabold,
    fontFamily: typography.fontFamily.primary,
  },
  
  buttonTextPrimary: {
    color: colors.white,
  },
  
  buttonTextSecondary: {
    color: colors.textSecondary,
  },
});

// Helper function to get font family with fallback
export const getFontFamily = (fontName: string = 'primary') => {
  return typography.fontFamily[fontName as keyof typeof typography.fontFamily] || typography.fontFamily.primary;
};

// Helper function to get color with opacity
export const getColorWithOpacity = (color: string, opacity: number) => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
