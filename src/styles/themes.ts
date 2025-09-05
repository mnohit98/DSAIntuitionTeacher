import { StyleSheet } from 'react-native';

// Theme interface for type safety
export interface Theme {
  // Colors
  colors: {
    // Background colors
    background: string;
    surface: string;
    surfaceSecondary: string;
    surfaceTertiary: string;
    
    // Text colors
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    textInverse: string;
    
    // Primary colors
    primary: string;
    primaryLight: string;
    primaryDark: string;
    primaryBorder: string;
    
    // Secondary colors
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    secondaryBorder: string;
    
    // Success colors
    success: string;
    successLight: string;
    successDark: string;
    successBorder: string;
    
    // Warning colors
    warning: string;
    warningLight: string;
    warningDark: string;
    warningBorder: string;
    
    // Info colors
    info: string;
    infoLight: string;
    infoDark: string;
    infoBorder: string;
    
    // Border colors
    border: string;
    borderLight: string;
    borderDark: string;
    
    // Shadow colors
    shadow: string;
    shadowLight: string;
    
    // Status colors
    error: string;
    errorLight: string;
    errorBorder: string;
  };
  
  // Typography
  typography: {
    fontFamily: {
      primary: string;
      fallback: string;
      system: string;
    };
    fontSize: {
      xs: number;
      sm: number;
      base: number;
      lg: number;
      xl: number;
      '2xl': number;
      '3xl': number;
      '4xl': number;
      '5xl': number;
      '6xl': number;
      '7xl': number;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
      extrabold: string;
      black: string;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
      loose: number;
    };
  };
  
  // Spacing
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
  };
  
  // Border radius
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
  };
  
  // Shadows
  shadows: {
    sm: any;
    md: any;
    lg: any;
    xl: any;
  };
  
  // Component-specific styles
  components: {
    card: any;
    button: any;
    header: any;
    input: any;
    modal: any;
  };
}

// Light Theme
export const lightTheme: Theme = {
  colors: {
    // Background colors
    background: '#FEFEFE', // Cream paper background
    surface: '#FFFFFF',
    surfaceSecondary: '#F9FAFB',
    surfaceTertiary: '#F3F4F6',
    
    // Text colors
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',
    
    // Primary colors (Blue)
    primary: '#0066CC',
    primaryLight: '#F0F8FF',
    primaryDark: '#1E90FF',
    primaryBorder: '#1E90FF',
    
    // Secondary colors (Red)
    secondary: '#FF6B6B',
    secondaryLight: '#FFE6E6',
    secondaryDark: '#E53E3E',
    secondaryBorder: '#E53E3E',
    
    // Success colors (Green)
    success: '#32CD32',
    successLight: '#F0FFF0',
    successDark: '#228B22',
    successBorder: '#228B22',
    
    // Warning colors (Yellow)
    warning: '#FFD700',
    warningLight: '#FFF8DC',
    warningDark: '#B8860B',
    warningBorder: '#B8860B',
    
    // Info colors (Purple)
    info: '#8B5CF6',
    infoLight: '#F8F7FF',
    infoDark: '#6A0DAD',
    infoBorder: '#6A0DAD',
    
    // Border colors
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    borderDark: '#D1D5DB',
    
    // Shadow colors
    shadow: '#000000',
    shadowLight: '#6B7280',
    
    // Status colors
    error: '#EF4444',
    errorLight: '#FEE2E2',
    errorBorder: '#DC2626',
  },
  
  typography: {
    fontFamily: {
      primary: 'Virgil',
      fallback: 'IndieFlower',
      system: 'System',
    },
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
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    lineHeight: {
      tight: 20,
      normal: 24,
      relaxed: 28,
      loose: 32,
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 60,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
  },
  
  components: {
    card: {
      backgroundColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      borderStyle: 'dashed',
    },
    button: {
      borderStyle: 'dashed',
    },
    header: {
      backgroundColor: '#F0F8FF',
      borderColor: '#1E90FF',
      borderStyle: 'dashed',
    },
    input: {
      backgroundColor: '#FFFFFF',
      borderColor: '#E5E7EB',
    },
    modal: {
      backgroundColor: '#FFFFFF',
      borderColor: '#E5E7EB',
    },
  },
};

// Dark Theme
export const darkTheme: Theme = {
  colors: {
    // Background colors
    background: '#0F172A', // Dark blue background
    surface: '#1E293B',
    surfaceSecondary: '#334155',
    surfaceTertiary: '#475569',
    
    // Text colors
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    textInverse: '#0F172A',
    
    // Primary colors (Blue)
    primary: '#60A5FA',
    primaryLight: '#1E3A8A',
    primaryDark: '#3B82F6',
    primaryBorder: '#3B82F6',
    
    // Secondary colors (Red)
    secondary: '#F87171',
    secondaryLight: '#7F1D1D',
    secondaryDark: '#DC2626',
    secondaryBorder: '#DC2626',
    
    // Success colors (Green)
    success: '#4ADE80',
    successLight: '#14532D',
    successDark: '#16A34A',
    successBorder: '#16A34A',
    
    // Warning colors (Yellow)
    warning: '#FBBF24',
    warningLight: '#78350F',
    warningDark: '#D97706',
    warningBorder: '#D97706',
    
    // Info colors (Purple)
    info: '#A78BFA',
    infoLight: '#581C87',
    infoDark: '#7C3AED',
    infoBorder: '#7C3AED',
    
    // Border colors
    border: '#475569',
    borderLight: '#64748B',
    borderDark: '#334155',
    
    // Shadow colors
    shadow: '#000000',
    shadowLight: '#475569',
    
    // Status colors
    error: '#F87171',
    errorLight: '#7F1D1D',
    errorBorder: '#DC2626',
  },
  
  typography: {
    fontFamily: {
      primary: 'Virgil',
      fallback: 'IndieFlower',
      system: 'System',
    },
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
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    lineHeight: {
      tight: 20,
      normal: 24,
      relaxed: 28,
      loose: 32,
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 60,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.6,
      shadowRadius: 12,
      elevation: 6,
    },
  },
  
  components: {
    card: {
      backgroundColor: '#1E293B',
      borderColor: '#475569',
      borderStyle: 'dashed',
    },
    button: {
      borderStyle: 'dashed',
    },
    header: {
      backgroundColor: '#1E3A8A',
      borderColor: '#3B82F6',
      borderStyle: 'dashed',
    },
    input: {
      backgroundColor: '#1E293B',
      borderColor: '#475569',
    },
    modal: {
      backgroundColor: '#1E293B',
      borderColor: '#475569',
    },
  },
};

// Theme context type
export type ThemeType = 'light' | 'dark';

// Helper function to get theme
export const getTheme = (themeType: ThemeType): Theme => {
  return themeType === 'light' ? lightTheme : darkTheme;
};

// Helper function to get font family with fallback
export const getFontFamily = (theme: Theme, fontName: string = 'primary') => {
  return theme.typography.fontFamily[fontName as keyof typeof theme.typography.fontFamily] || theme.typography.fontFamily.primary;
};

// Helper function to get color with opacity
export const getColorWithOpacity = (color: string, opacity: number) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
