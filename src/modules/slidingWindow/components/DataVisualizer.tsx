import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DataElement {
  value: string | number;
  state: 'in_window' | 'out_of_window_past' | 'not_yet_reached' | 'processed' | 'transformed';
}

interface Props {
  uiState: {
    arrayElements: DataElement[];
    highlightedElements: number[];
    windowStart?: number;
    windowEnd?: number;
  };
  onElementPress: (index: number) => void;
  expectedIndex?: number;
  showInitializeButton?: boolean;
  onInitializePress?: () => void;
  showCompleteButton?: boolean;
  onCompletePress?: () => void;
}

export default function DataVisualizer({ 
  uiState, 
  onElementPress, 
  expectedIndex, 
  showInitializeButton = false, 
  onInitializePress,
  showCompleteButton = false,
  onCompletePress
}: Props) {
  const [/*showInfoDropdown*/, /*setShowInfoDropdown*/] = useState(false);

  const blinkAnim = useRef(new Animated.Value(0)).current;
  const windowBoxAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const windowBoxWidthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Single blink animation - runs only once
    Animated.sequence([
      Animated.timing(blinkAnim, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      Animated.timing(blinkAnim, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
    ]).start();
  }, [blinkAnim]);

  // Constants for symmetric window box calculation
  const ELEMENT_WIDTH = 60;
  const ELEMENT_MARGIN = 6 + 4; // 10px before element (6 from wrapper + 4 from element)
  const ELEMENT_SPACING = 92; // center-to-center step (60 + 10 + 10 + 12 gap)

  // Calculate element center position
  const elementCenterX = (index: number) => {
    return index * ELEMENT_SPACING + ELEMENT_MARGIN + ELEMENT_WIDTH / 2;
  };

  // Calculate symmetric window box dimensions
  const calculateWindowBox = (startIndex: number, endIndex: number) => {
    const startCenter = elementCenterX(startIndex);
    const endCenter = elementCenterX(endIndex);

    // Half-width of one element for symmetry padding
    const halfElement = ELEMENT_WIDTH / 2 + ELEMENT_MARGIN;

    // For symmetric padding: extend half-element width on each side
    const boxX = startCenter - halfElement;
    const boxWidth = (endCenter - startCenter) + ELEMENT_WIDTH + 2 * ELEMENT_MARGIN;

    return {
      x: boxX,
      width: boxWidth,
    };
  };

  // Animate window box when window changes
  useEffect(() => {
    const { windowStart, windowEnd } = uiState;
    
    if (windowStart !== null && windowStart !== undefined && 
        windowEnd !== null && windowEnd !== undefined) {
      const boxDimensions = calculateWindowBox(windowStart, windowEnd);
      
      // Animate to new position and width
      Animated.parallel([
        Animated.timing(windowBoxAnim, {
          toValue: { x: boxDimensions.x, y: -8 }, // y: -8 for top margin offset
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(windowBoxWidthAnim, {
          toValue: boxDimensions.width,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [uiState.windowStart, uiState.windowEnd, windowBoxAnim, windowBoxWidthAnim]);

  const getElementStyle = (element: DataElement) => {
    switch (element.state) {
      case 'in_window':
        return [styles.element, styles.inWindow];
      case 'out_of_window_past':
        return [styles.element, styles.outOfWindow];
      case 'not_yet_reached':
        return [styles.element, styles.notYetReached];
      default:
        return styles.element;
    }
  };

  const getElementTextStyle = (element: DataElement) => {
    switch (element.state) {
      case 'in_window':
        return styles.inWindowText;
      case 'out_of_window_past':
        return styles.outOfWindowText;
      case 'not_yet_reached':
        return styles.notYetReachedText;
      default:
        return styles.elementText;
    }
  };

  // Function to render animated window box around elements
  const renderWindowBox = () => {
    const { windowStart, windowEnd } = uiState;
    
    // Only show window box if we have valid window bounds
    if (windowStart === null || windowStart === undefined || 
        windowEnd === null || windowEnd === undefined) {
      return null;
    }

    // Calculate box height (same for all cases)
    const elementHeight = 60;
    const indexTextHeight = 16;
    const topMargin = 8;
    const bottomMargin = 8;
    const boxHeight = elementHeight + topMargin + indexTextHeight + bottomMargin;
    
    return (
      <Animated.View
        style={[
          styles.windowBox,
          {
            left: windowBoxAnim.x,
            top: windowBoxAnim.y,
            width: windowBoxWidthAnim,
            height: boxHeight,
          }
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        {/* Window Box - positioned behind elements */}
        {renderWindowBox()}
        
        {uiState.arrayElements.map((element: DataElement, index: number) => {
          const content = (
            <View style={styles.elementContainer}>
              <TouchableOpacity
                style={getElementStyle(element)}
                onPress={() => onElementPress(index)}
                disabled={element.state === 'out_of_window_past'}
              >
                <Text style={getElementTextStyle(element)}>{element.value}</Text>
              </TouchableOpacity>
              <Text style={styles.indexText}>{index}</Text>
            </View>
          );

          return (
            <View key={index} style={styles.elementWrapper}>
              {content}
            </View>
          );
        })}
      </View>
      
      {/* Initialize Button */}
      {showInitializeButton && onInitializePress && (
        <View style={styles.initializeButtonContainer}>
          <Animated.View
            style={[
              styles.initializeButtonWrapper,
              {
                shadowOpacity: blinkAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] }),
                transform: [
                  {
                    scale: blinkAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] })
                  }
                ]
              }
            ]}
          >
            <TouchableOpacity
              style={styles.initializeButton}
              onPress={onInitializePress}
              activeOpacity={0.8}
            >
              <Text style={styles.initializeButtonText}>Initialize Variables</Text>
              <Text style={styles.initializeButtonSubtext}>Click to set up algorithm variables</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
      
      {/* Complete Algorithm Button */}
      {showCompleteButton && onCompletePress && (
        <View style={styles.completeButtonContainer}>
          <Animated.View
            style={[
              styles.completeButtonWrapper,
              {
                shadowOpacity: blinkAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] }),
                transform: [
                  {
                    scale: blinkAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] })
                  }
                ]
              }
            ]}
          >
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => {
                console.log('Complete Algorithm button pressed!');
                onCompletePress();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.completeButtonText}>🎉 Complete Algorithm</Text>
              <Text style={styles.completeButtonSubtext}>Click to finish the walkthrough</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    flex: 1,
    position: 'relative',
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
    paddingHorizontal: 0,
    position: 'relative',
  },
  elementWrapper: {
    alignItems: 'center',
    marginHorizontal: 6,
  },
  elementContainer: {
    alignItems: 'center',
  },
  element: {
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inWindow: {
    backgroundColor: '#22C55E',
    borderColor: '#16A34A',
    transform: [{ scale: 1.1 }],
  },
  outOfWindow: {
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
    opacity: 0.6,
  },
  notYetReached: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  elementText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  inWindowText: {
    color: '#059669',
  },
  outOfWindowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  notYetReachedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  indexText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  
  // Initialize Button Styles
  initializeButtonContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  initializeButtonWrapper: {
    shadowColor: '#F5D90A',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 12,
  },
  initializeButton: {
    backgroundColor: '#F5D90A',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#D97706',
    alignItems: 'center',
    minWidth: 200,
  },
  initializeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#080A0D',
    marginBottom: 4,
  },
  initializeButtonSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  
  // Complete Algorithm Button Styles
  completeButtonContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  completeButtonWrapper: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 12,
  },
  completeButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#059669',
    alignItems: 'center',
    minWidth: 200,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  completeButtonSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#D1FAE5',
    textAlign: 'center',
  },
  
  // Window Box Styles
  windowBox: {
    position: 'absolute',
    backgroundColor: 'rgba(59, 130, 246, 0.08)', // Subtle blue background
    borderWidth: 2,
    borderColor: '#3B82F6', // Blue border
    borderRadius: 16,
    zIndex: 0, // Behind elements
    borderStyle: 'dashed',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
});
