import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';

interface Props {
  problemData: any;
}

export default function CompletionScreen({ 
  problemData
}: Props) {
  const [showContent, setShowContent] = useState(false);
  
  // Animation values
  const tickScale = useRef(new Animated.Value(0)).current;
  const tickRotation = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const celebrationScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Show content immediately
    setShowContent(true);
    contentOpacity.setValue(1);
    
    // Start celebration animation sequence
    const animationSequence = Animated.sequence([
      // 1. Big tick animation (like payment success)
      Animated.parallel([
        Animated.spring(tickScale, {
          toValue: 1,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(tickRotation, {
          toValue: 1,
          duration: 600,
          easing: Easing.elastic(1.2),
          useNativeDriver: true,
        }),
      ]),
      
      // 2. Celebration pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(celebrationScale, {
            toValue: 1.1,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(celebrationScale, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        { iterations: 2 }
      ),
    ]);

    // Start animation
    animationSequence.start();
  }, []);

  const tickRotationDegrees = tickRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Get complete solution code from JSON with intuition comments
  const getCompleteCode = () => {
    if (problemData.code?.cpp) {
      return problemData.code.cpp;
    }
    
    // Fallback if no code in JSON
    return `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int findMaxSumSubArray(int k, const vector<int>& arr) {
        // INTUITION: We need variables to track our sliding window
        int windowSum = 0;    // Tracks current window sum
        int maxSum = 0;       // Remembers the best sum found
        int windowStart = 0;  // Marks where window begins
        
        // INTUITION: Build the first window of size k
        for (int windowEnd = 0; windowEnd < arr.size(); windowEnd++) {
            // Add the current element to our window
            windowSum += arr[windowEnd];
            
            // INTUITION: Once we have a complete window, start sliding
            if (windowEnd >= k - 1) {
                // Update maxSum if current window is better
                maxSum = max(maxSum, windowSum);
                
                // INTUITION: Slide the window - remove leftmost element
                windowSum -= arr[windowStart];
                windowStart++; // Move window start forward
            }
        }
        
        // INTUITION: Return the best sum we found
        return maxSum;
    }
};

// Example: findMaxSumSubArray(3, {2, 1, 5, 1, 3, 2})
// Returns: 9 (from subarray [5, 1, 3])`;
  };

  return (
    <View style={styles.container}>
      {/* Celebration Header */}
      <View style={styles.celebrationContainer}>
        <Animated.View style={{ transform: [{ scale: celebrationScale }] }}>
          <View style={styles.titleRow}>
            <Animated.View
              style={[
                styles.inlineTickContainer,
                {
                  transform: [
                    { scale: tickScale },
                    { rotate: tickRotationDegrees }
                  ]
                }
              ]}
            >
              <Text style={styles.inlineTickIcon}>✓</Text>
            </Animated.View>
            <Text style={styles.celebrationTitle}>Problem Solved!</Text>
          </View>
          <Text style={styles.celebrationSubtitle}>You've mastered the {problemData.title}</Text>
        </Animated.View>
      </View>

      {/* Content Section */}
      <Animated.View style={[styles.contentContainer, { opacity: contentOpacity }]}>
        {/* Complete Code Solution */}
        <View style={styles.terminalContainer}>
          <View style={styles.terminalHeader}>
            <View style={styles.terminalButtons}>
              <View style={[styles.terminalButton, { backgroundColor: '#FF5F57' }]} />
              <View style={[styles.terminalButton, { backgroundColor: '#FFBD2E' }]} />
              <View style={[styles.terminalButton, { backgroundColor: '#28CA42' }]} />
            </View>
            <Text style={styles.terminalTitle}>solution.cpp</Text>
          </View>
          <ScrollView 
            style={styles.terminalContent} 
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            <Text style={styles.codeText}>{getCompleteCode()}</Text>
          </ScrollView>
        </View>

        </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10, // Reduced horizontal padding for more width
    paddingVertical: 20,
    flex: 1,
    width: '100%',
  },

  // Celebration Section
  celebrationContainer: {
    alignItems: 'center',
    marginTop: 20, // Reduced margin to keep content within container
    marginBottom: 16,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  inlineTickContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  inlineTickIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  celebrationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
    textAlign: 'center',
  },

  celebrationSubtitle: {
    fontSize: 14,
    color: '#B4BCC8',
    textAlign: 'center',
  },

  // Content Section
  contentContainer: {
    width: '150%',
    maxWidth: '98%', // Take 98% of screen width for more space
    flex: 1,
    marginTop: 20,
  },

  // Terminal Styling
  terminalContainer: {
    backgroundColor: '#0A0E13',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2632',
    overflow: 'hidden',
    flex: 1,
    width: '100%', // Ensure full width usage
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  terminalHeader: {
    backgroundColor: '#1A1D23',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
  },

  terminalButtons: {
    flexDirection: 'row',
    gap: 6,
  },

  terminalButton: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  terminalTitle: {
    fontSize: 12,
    color: '#B4BCC8',
    marginLeft: 12,
    fontFamily: 'monospace',
  },

  terminalContent: {
    flex: 1,
    padding: 16,
    maxHeight: '100%', // Ensure scrolling works
  },

  codeText: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#10B981',
    lineHeight: 18,
  },

});
