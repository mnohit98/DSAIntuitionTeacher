import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'button' | 'icon' | 'minimal';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'medium',
  variant = 'button' 
}) => {
  const { theme, themeType, toggleTheme, isDark } = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: theme.spacing.sm,
          fontSize: theme.typography.fontSize.sm,
          borderRadius: theme.borderRadius.sm,
        };
      case 'large':
        return {
          padding: theme.spacing.lg,
          fontSize: theme.typography.fontSize.lg,
          borderRadius: theme.borderRadius.lg,
        };
      default: // medium
        return {
          padding: theme.spacing.md,
          fontSize: theme.typography.fontSize.base,
          borderRadius: theme.borderRadius.md,
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'icon':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 2,
          borderColor: theme.colors.border,
          minWidth: 48,
          minHeight: 48,
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
        };
      case 'minimal':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default: // button
        return {
          backgroundColor: theme.colors.primary,
          borderWidth: 2,
          borderColor: theme.colors.primaryBorder,
          minWidth: 120,
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const buttonStyle = [
    styles.base,
    sizeStyles,
    variantStyles,
    {
      shadowColor: theme.colors.shadow,
      ...theme.shadows.md,
    },
  ];

  const textStyle = [
    styles.text,
    {
      fontSize: sizeStyles.fontSize,
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: '700' as const,
      color: variant === 'button' ? theme.colors.textInverse : theme.colors.textPrimary,
    },
  ];

  const getToggleText = () => {
    if (variant === 'icon') {
      return isDark ? '☀️' : '🌙';
    }
    if (variant === 'minimal') {
      return isDark ? 'Light Mode' : 'Dark Mode';
    }
    return isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={toggleTheme}
      activeOpacity={0.8}
    >
      <Text style={textStyle}>{getToggleText()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderStyle: 'dashed',
    elevation: 2,
  },
  text: {
    textAlign: 'center',
  },
});

export default ThemeToggle;
