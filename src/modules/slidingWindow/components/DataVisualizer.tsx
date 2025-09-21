import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DataElement {
  value: string | number;
  state: 'in_window' | 'out_of_window_past' | 'not_yet_reached';
}

interface Props {
  uiState: {
    arrayElements: DataElement[];
    highlightedElements: number[];
    windowStart?: number;
    windowEnd?: number;
    windowSum?: number;
    maxSum?: number;
  };
  problemData?: any;
  onElementPress: (index: number) => void;
  expectedIndex?: number;
  showInitializeButton?: boolean;
  onInitializePress?: () => void;
  showCompleteButton?: boolean;
  onCompletePress?: () => void;
}

export default function DataVisualizer({ 
  uiState, 
  problemData,
  onElementPress, 
  expectedIndex, 
  showInitializeButton = false, 
  onInitializePress,
  showCompleteButton = false,
  onCompletePress
}: Props) {

  const blinkAnim = useRef(new Animated.Value(0)).current;
  const windowBoxAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const windowBoxWidthAnim = useRef(new Animated.Value(0)).current;
  const startPointerAnim = useRef(new Animated.Value(1)).current;
  const endPointerAnim = useRef(new Animated.Value(1)).current;

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

  // Calculate element left edge position
  const elementLeftX = (index: number) => {
    return index * ELEMENT_SPACING + ELEMENT_MARGIN;
  };

  // Calculate element right edge position
  const elementRightX = (index: number) => {
    return index * ELEMENT_SPACING + ELEMENT_MARGIN + ELEMENT_WIDTH;
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

  // Animate pointers when they change
  useEffect(() => {
    const { windowStart, windowEnd } = uiState;
    
    // Animate start pointer
    if (windowStart !== null && windowStart !== undefined) {
      Animated.sequence([
        Animated.timing(startPointerAnim, {
          toValue: 1.2,
          duration: 150,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(startPointerAnim, {
          toValue: 1,
          duration: 150,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Animate end pointer
    if (windowEnd !== null && windowEnd !== undefined) {
      Animated.sequence([
        Animated.timing(endPointerAnim, {
          toValue: 1.2,
          duration: 150,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(endPointerAnim, {
          toValue: 1,
          duration: 150,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }

  }, [uiState.windowStart, uiState.windowEnd, startPointerAnim, endPointerAnim]);

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

  // Function to render window start pointer
  const renderWindowStartPointer = () => {
    const { windowStart } = uiState;
    
    if (windowStart === null || windowStart === undefined) {
      return null;
    }

    const pointerX = elementLeftX(windowStart) - 10; // Point at the left edge of the start element
    
    return (
      <View style={[styles.pointerContainer, { left: pointerX }]}>
        <View style={styles.pointerLabel}>
          <Text style={styles.pointerLabelText}>windowStart</Text>
          <Text style={styles.pointerValueText}>{windowStart}</Text>
        </View>
        <Animated.View style={[styles.pointerArrow, { transform: [{ scale: startPointerAnim }] }]}>
          <Text style={styles.pointerSymbol}>↓</Text>
        </Animated.View>
      </View>
    );
  };

  // Function to render window end pointer
  const renderWindowEndPointer = () => {
    const { windowEnd } = uiState;
    
    if (windowEnd === null || windowEnd === undefined) {
      return null;
    }

    const pointerX = elementLeftX(windowEnd) - 10; // Point at the left edge of the end element (same as windowStart)
    
    return (
      <View style={[styles.pointerContainerBottom, { left: pointerX }]}>
        <Animated.View style={[styles.pointerArrow, { transform: [{ scale: endPointerAnim }] }]}>
          <Text style={styles.pointerSymbol}>↑</Text>
        </Animated.View>
        <View style={styles.pointerLabelBottom}>
          <Text style={styles.pointerLabelText}>windowEnd</Text>
          <Text style={styles.pointerValueText}>{windowEnd}</Text>
        </View>
      </View>
    );
  };


  // Function to render algorithm variables display - flexible and decoupled
  const renderVariablesDisplay = () => {
    const { windowStart, windowEnd, windowSum, maxSum } = uiState;
    
    // Calculate current window size
    const currentWindowSize = windowStart !== undefined && windowEnd !== undefined 
      ? windowEnd - windowStart + 1 
      : 0;
    
    // Get target size k from problem data (dynamic)
    const targetSizeK = problemData?.playground?.initialState?.k || 3;
    
    // Define variables array for flexible rendering
    const variables = [
      { label: 'target size k:', value: targetSizeK },
      { label: 'windowSize:', value: currentWindowSize },
      { label: 'windowSum:', value: windowSum || 0 },
      { label: 'maxSum:', value: maxSum || 0 }
    ];
    
    return (
      <View style={styles.variablesDisplay}>
        {variables.map((variable, index) => (
          <View key={index} style={styles.variableItem}>
            <Text style={styles.variableLabel}>{variable.label}</Text>
            <Text style={styles.variableValue}>{variable.value}</Text>
          </View>
        ))}
      </View>
    );
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
    <>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
      <View style={styles.dataContainer}>
        {/* Window Box - positioned behind elements */}
        {renderWindowBox()}
        
        {/* Window Pointers - positioned above elements */}
        {renderWindowStartPointer()}
        {renderWindowEndPointer()}
        
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
              onPress={onCompletePress}
              activeOpacity={0.8}
            >
              <Text style={styles.completeButtonText}>🎉 Complete Algorithm</Text>
              <Text style={styles.completeButtonSubtext}>Click to finish the walkthrough</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
        </View>
      </View>
      
      {/* Variables Display - completely decoupled */}
      {renderVariablesDisplay()}
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
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

  // Visual Pointers Styles
  pointerContainer: {
    position: 'absolute',
    top: -80, // Position above elements with margin
    zIndex: 10, // Above elements
    alignItems: 'center',
  },
  pointerContainerBottom: {
    position: 'absolute',
    top: 96, // Position below elements with margin (60px element + 16px index text + 20px margin)
    zIndex: 10, // Above elements
    alignItems: 'center',
  },
  pointerArrow: {
    width: 20,
    height: 20,
    backgroundColor: '#10B981', // Green background
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#059669',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  pointerSymbol: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pointerLabel: {
    backgroundColor: '#1A1D23',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#2D3748',
    alignItems: 'center',
    minWidth: 50,
  },
  pointerLabelBottom: {
    backgroundColor: '#1A1D23',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#2D3748',
    alignItems: 'center',
    minWidth: 50,
  },
  pointerLabelText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
  },
  pointerValueText: {
    fontSize: 12,
    color: '#E8ECF2',
    fontWeight: 'bold',
    marginTop: 2,
  },

  variablesDisplay: {
    position: 'fixed',
    bottom: 24, // Small margin from screen bottom
    left: '50%', // Center horizontally
    transform: [{ translateX: -400 }], // Offset by half the max width to center
    backgroundColor: '#111720',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E2632',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center the variables within the container
    alignItems: 'flex-start', // Align to top for better wrapping
    gap: 12, // Increased gap for better spacing
    minHeight: 'auto', // Let it size naturally
    width: 800, // Fixed width for centering
    zIndex: 1000, // Ensure it stays on top
  },
  variableItem: {
    backgroundColor: '#1A1D23',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2D3748',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4, // Small margin for better vertical spacing when wrapped
    flexShrink: 0, // Prevent shrinking
    minWidth: 'auto', // Let it size naturally
  },
  variableLabel: {
    fontSize: 12,
    color: '#B4BCC8',
    fontWeight: '500',
  },
  variableValue: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
});
