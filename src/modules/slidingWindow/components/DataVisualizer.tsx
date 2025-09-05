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
  };
  onElementPress: (index: number) => void;
  expectedIndex?: number;
}

export default function DataVisualizer({ uiState, onElementPress, expectedIndex }: Props) {
  const [/*showInfoDropdown*/, /*setShowInfoDropdown*/] = useState(false);

  const blinkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        Animated.timing(blinkAnim, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      ])
    ).start();
  }, [blinkAnim]);

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

  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        {uiState.arrayElements.map((element: DataElement, index: number) => {
          const isExpected = typeof expectedIndex === 'number' && expectedIndex === index && element.state !== 'out_of_window_past';
          const highlightOpacity = blinkAnim.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] });
          const highlightBorder = blinkAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

          const content = (
            <TouchableOpacity
              style={getElementStyle(element)}
              onPress={() => onElementPress(index)}
              disabled={element.state === 'out_of_window_past'}
            >
              <Text style={getElementTextStyle(element)}>{element.value}</Text>
            </TouchableOpacity>
          );

          if (!isExpected) {
            return (
              <View key={index} style={styles.elementWrapper}>
                {content}
              </View>
            );
          }

          return (
            <Animated.View
              key={index}
              style={[
                styles.elementWrapper,
                styles.blinkWrapper,
                {
                  borderColor: '#F5D90A',
                  borderWidth: 2,
                  shadowColor: '#F5D90A',
                  shadowOpacity: highlightOpacity as unknown as number,
                  opacity: highlightOpacity as unknown as number,
                },
              ]}
            >
              {content}
            </Animated.View>
          );
        })}
      </View>
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
  },
  elementWrapper: {
    alignItems: 'center',
    marginHorizontal: 6,
  },
  blinkWrapper: {
    borderRadius: 14,
    padding: 2,
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
  },
});
