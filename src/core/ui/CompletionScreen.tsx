import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CodeModal from './CodeModal';

interface Props {
  problemData: any;
  onTryAgain: () => void;
  onNextProblem: () => void;
  onNextModule: () => void;
}

export default function CompletionScreen({ 
  problemData, 
  onTryAgain, 
  onNextProblem, 
  onNextModule 
}: Props) {
  const [showContent, setShowContent] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  
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
        <Animated.View
          style={[
            styles.tickContainer,
            {
              transform: [
                { scale: celebrationScale },
                { scale: tickScale },
                { rotate: tickRotationDegrees }
              ]
            }
          ]}
        >
          <Text style={styles.tickIcon}>✓</Text>
        </Animated.View>
        
        <Animated.View style={{ transform: [{ scale: celebrationScale }] }}>
          <Text style={styles.celebrationTitle}>🎉 Problem Solved!</Text>
          <Text style={styles.celebrationSubtitle}>You've mastered the {problemData.title}</Text>
        </Animated.View>
      </View>

      {/* Content Section */}
      <Animated.View style={[styles.contentContainer, { opacity: contentOpacity }]}>
        {/* Complete Code Solution */}
        <View style={styles.codeSection}>
            <View style={styles.codeSectionHeader}>
              <View style={styles.codeSectionHeaderLeft}>
                <Text style={styles.codeSectionTitle}>🏆 Complete Solution</Text>
                <Text style={styles.codeSectionSubtitle}>Intuition mapped to implementation</Text>
              </View>
              <TouchableOpacity 
                style={styles.enlargeButton} 
                onPress={() => setShowCodeModal(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.enlargeButtonIcon}>⛶</Text>
                <Text style={styles.enlargeButtonText}>Enlarge</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.codeScrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.terminalContainer}>
                <View style={styles.terminalHeader}>
                  <View style={styles.terminalButtons}>
                    <View style={[styles.terminalButton, { backgroundColor: '#FF5F57' }]} />
                    <View style={[styles.terminalButton, { backgroundColor: '#FFBD2E' }]} />
                    <View style={[styles.terminalButton, { backgroundColor: '#28CA42' }]} />
                  </View>
                  <Text style={styles.terminalTitle}>solution.cpp</Text>
                </View>
                <View style={styles.terminalContent}>
                  <Text style={styles.codeText}>{getCompleteCode()}</Text>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Navigation Options */}
          <View style={styles.navigationSection}>
            <Text style={styles.navigationTitle}>What's Next?</Text>
            
            <View style={styles.navigationGrid}>
              <TouchableOpacity style={styles.navButton} onPress={onTryAgain} activeOpacity={0.8}>
                <Text style={styles.navButtonIcon}>🔄</Text>
                <Text style={styles.navButtonText}>Try Again</Text>
                <Text style={styles.navButtonSubtext}>Practice makes perfect</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.navButton} onPress={onNextProblem} activeOpacity={0.8}>
                <Text style={styles.navButtonIcon}>➡️</Text>
                <Text style={styles.navButtonText}>Next Problem</Text>
                <Text style={styles.navButtonSubtext}>Continue learning</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.navButton} onPress={onNextModule} activeOpacity={0.8}>
                <Text style={styles.navButtonIcon}>🚀</Text>
                <Text style={styles.navButtonText}>Next Module</Text>
                <Text style={styles.navButtonSubtext}>New algorithm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Code Modal */}
        <CodeModal
          visible={showCodeModal}
          onClose={() => setShowCodeModal(false)}
          problemData={problemData}
          code={getCompleteCode()}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    maxHeight: 600,
    width: '100%',
  },

  // Celebration Section
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  tickContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  tickIcon: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  celebrationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
    textAlign: 'center',
    marginBottom: 4,
  },

  celebrationSubtitle: {
    fontSize: 14,
    color: '#B4BCC8',
    textAlign: 'center',
  },

  // Content Section
  contentContainer: {
    width: '100%',
    maxWidth: 700,
  },

  // Code Section
  codeSection: {
    backgroundColor: '#111720',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2632',
    marginBottom: 24,
    overflow: 'hidden',
    maxHeight: 250,
  },

  codeSectionHeader: {
    backgroundColor: '#1A1D23',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  codeSectionHeaderLeft: {
    flex: 1,
  },

  codeSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },

  codeSectionSubtitle: {
    fontSize: 14,
    color: '#B4BCC8',
  },

  enlargeButton: {
    backgroundColor: '#2D3748',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#4A5568',
  },

  enlargeButtonIcon: {
    fontSize: 14,
    color: '#10B981',
  },

  enlargeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },

  codeScrollView: {
    maxHeight: 180,
  },

  // Terminal Styling
  terminalContainer: {
    margin: 16,
    backgroundColor: '#0A0E13',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E2632',
    overflow: 'hidden',
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
    padding: 16,
  },

  codeText: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#10B981',
    lineHeight: 18,
  },

  // Navigation Section
  navigationSection: {
    backgroundColor: '#111720',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E2632',
  },

  navigationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E8ECF2',
    textAlign: 'center',
    marginBottom: 20,
  },

  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },

  navButton: {
    backgroundColor: '#1A1D23',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 140,
    borderWidth: 1,
    borderColor: '#2D3748',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  navButtonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },

  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E8ECF2',
    marginBottom: 4,
  },

  navButtonSubtext: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
});
