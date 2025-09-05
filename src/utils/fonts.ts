// Font utility for handwritten notes theme
export const getHandwrittenFont = () => {
  // Try to use Virgil first, then fallback to other handwritten fonts
  // If none are available, use system fonts
  return {
    primary: 'Virgil',
    fallback: 'IndieFlower',
    system: 'System',
  };
};

export const getFontFamily = (fontName: string) => {
  const fonts = getHandwrittenFont();
  
  switch (fontName) {
    case 'Virgil':
      return fonts.primary;
    case 'IndieFlower':
      return fonts.fallback;
    default:
      return fonts.system;
  }
};

// Color scheme for handwritten notes theme
export const noteColors = {
  // Blue for main notes
  primary: '#0066CC',
  primaryLight: '#F0F8FF',
  primaryBorder: '#1E90FF',
  
  // Red for important notes
  secondary: '#FF6B6B',
  secondaryLight: '#FFE6E6',
  secondaryBorder: '#E53E3E',
  
  // Green for code/implementation notes
  success: '#32CD32',
  successLight: '#F0FFF0',
  successBorder: '#228B22',
  
  // Yellow for step descriptions
  warning: '#FFD700',
  warningLight: '#FFF8DC',
  warningBorder: '#B8860B',
  
  // Purple for code bot
  info: '#8B5CF6',
  infoLight: '#F8F7FF',
  infoBorder: '#6A0DAD',
  
  // Paper background
  paper: '#FEFEFE',
  paperLight: '#F9F9F9',
  
  // Text colors
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
};
