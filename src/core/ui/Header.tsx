import React, { useState } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { router, usePathname } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import NavigationService from '../services/NavigationService';

interface PlaygroundHeaderProps {
  title: string;
  subtitle?: string;
  problemData: any;
  onShowProblemModal: () => void;
  onReset: () => void;
  isFullWindowMode: boolean;
  onToggleFullscreen: () => void;
}

export default function PlaygroundHeader({
  title,
  subtitle,
  problemData,
  onShowProblemModal,
  onReset,
  isFullWindowMode,
  onToggleFullscreen
}: PlaygroundHeaderProps) {
  const { theme } = useTheme();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const getTooltipText = (action: string) => {
    switch (action) {
      case 'bookmark':
        return isBookmarked ? 'Unbookmark' : 'Bookmark';
      case 'completion':
        return isCompleted ? 'Undo' : 'Complete';
      case 'problem':
        return 'Details';
      case 'fullscreen':
        return isFullWindowMode ? 'Exit' : 'Fullscreen';
      case 'reset':
        return 'Reset';
      default:
        return '';
    }
  };

  const renderTooltip = (action: string) => {
    if (hoveredAction === action) {
      return (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            {getTooltipText(action)}
          </Text>
          {/* Arrow pointing to the button */}
          <View style={styles.tooltipArrow} />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonIcon}>←</Text>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text 
            style={[
              styles.title, 
              title.length > 30 && styles.titleLong,
              title.length > 50 && styles.titleVeryLong
            ]}
            numberOfLines={title.length > 50 ? 2 : 1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>
        
        <View style={styles.headerActions}>
          {/* Bookmark toggle */}
          <TouchableOpacity 
            style={[styles.actionButton, isBookmarked && styles.bookmarkActive]}
            onPress={() => setIsBookmarked(prev => !prev)}
            activeOpacity={0.8}
            {...(Platform.OS === 'web' && {
              onMouseEnter: () => setHoveredAction('bookmark'),
              onMouseLeave: () => setHoveredAction(null)
            })}
          >
            <Text style={[styles.actionButtonText, isBookmarked && styles.actionButtonTextActive]}>
              {isBookmarked ? '★' : '☆'}
            </Text>
            {renderTooltip('bookmark')}
          </TouchableOpacity>

          {/* Completion toggle */}
          <TouchableOpacity 
            style={[styles.actionButton, isCompleted && styles.completeActive]}
            onPress={() => setIsCompleted(prev => !prev)}
            activeOpacity={0.8}
            {...(Platform.OS === 'web' && {
              onMouseEnter: () => setHoveredAction('completion'),
              onMouseLeave: () => setHoveredAction(null)
            })}
          >
            <Text style={[styles.actionButtonText, isCompleted && styles.actionButtonTextActive]}>
              {isCompleted ? '✔' : '○'}
            </Text>
            {renderTooltip('completion')}
          </TouchableOpacity>

          {/* Problem description modal */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onShowProblemModal}
            activeOpacity={0.8}
            {...(Platform.OS === 'web' && {
              onMouseEnter: () => setHoveredAction('problem'),
              onMouseLeave: () => setHoveredAction(null)
            })}
          >
            <Text style={styles.actionButtonText}>📄</Text>
            {renderTooltip('problem')}
          </TouchableOpacity>
          
          {/* Fullscreen toggle */}
          <TouchableOpacity 
            style={[styles.actionButton, isFullWindowMode && styles.actionButtonActive]}
            onPress={onToggleFullscreen}
            activeOpacity={0.8}
            {...(Platform.OS === 'web' && {
              onMouseEnter: () => setHoveredAction('fullscreen'),
              onMouseLeave: () => setHoveredAction(null)
            })}
          >
            <Text style={[styles.actionButtonText, isFullWindowMode && styles.actionButtonTextActive]}>
              {isFullWindowMode ? '⛶' : '⛶'}
            </Text>
            {renderTooltip('fullscreen')}
          </TouchableOpacity>
          
          {/* Reset button */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onReset}
            activeOpacity={0.8}
            {...(Platform.OS === 'web' && {
              onMouseEnter: () => setHoveredAction('reset'),
              onMouseLeave: () => setHoveredAction(null)
            })}
          >
            <Text style={styles.actionButtonText}>↺</Text>
            {renderTooltip('reset')}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#0C1116',
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C1116',
    borderWidth: 1,
    borderColor: '#1E2632',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  backButtonIcon: {
    fontSize: 14,
    color: '#B4BCC8',
    marginRight: 6,
  },
  backButtonText: {
    fontSize: 12,
    color: '#B4BCC8',
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E8ECF2',
    textShadowColor: 'rgba(41, 211, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
  titleLong: {
    fontSize: 18, // Slightly smaller for long titles (30+ chars)
  },
  titleVeryLong: {
    fontSize: 16, // Even smaller for very long titles (50+ chars)
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 12,
    color: '#29D3FF',
    marginTop: 2,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    position: 'relative',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#111720',
    borderWidth: 1,
    borderColor: '#1E2632',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonActive: {
    backgroundColor: '#F5D90A',
    borderColor: '#F5D90A',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#B4BCC8',
    fontWeight: '600',
  },
  actionButtonTextActive: {
    color: '#080A0D',
    fontWeight: '700',
  },
  bookmarkActive: {
    backgroundColor: '#F5D90A',
    borderColor: '#F5D90A',
  },
  completeActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  tooltip: {
    position: 'absolute',
    right: 42, // Position to the left of the button
    top: 0, // Align with button top
    bottom: 0, // Align with button bottom  
    justifyContent: 'center', // Center content vertically
    backgroundColor: '#1A1D23',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#2D3748',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    minWidth: 60,
    maxWidth: 100, // Prevent tooltip from getting too wide
  },
  tooltipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#E2E8F0',
    textAlign: 'center',
    lineHeight: 14,
  },
  tooltipArrow: {
    position: 'absolute',
    right: -6, // Position the arrow to point to the button
    top: '50%',
    transform: [{ translateY: -3 }], // Center the arrow vertically
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderLeftColor: '#1A1D23',
    borderTopWidth: 3,
    borderTopColor: 'transparent',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
});
