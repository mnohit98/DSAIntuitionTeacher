import React, { useEffect, useRef } from 'react';
import { Animated, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  problemData: any;
  code: string;
}

export default function CodeModal({ visible, onClose, problemData, code }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    
    return (
      <Text style={styles.complexityText}>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const boldText = part.slice(2, -2);
            const isTCOrSC = boldText.includes('Time Complexity') || boldText.includes('Space Complexity');
            return (
              <Text 
                key={index} 
                style={[
                  styles.boldText, 
                  isTCOrSC && styles.highlightedComplexity
                ]}
              >
                {boldText}
              </Text>
            );
          }
          return <Text key={index}>{part}</Text>;
        })}
      </Text>
    );
  };

  const getComplexityAnalysis = () => {
    const optimal = problemData.solution?.optimal;
    if (!optimal) return null;

    return `**Time Complexity (TC): ${optimal.timeComplexity}** - ${optimal.idea}

**Space Complexity (SC): ${optimal.spaceComplexity}** - We only use a fixed number of variables regardless of input size. Constant space!

🎯 **Why this matters**: Sliding window transforms a naive O(n×k) brute force approach into an elegant O(n) solution. For an array of 1000 elements with k=100, we go from 100,000 operations to just 1,000 operations - that's 100x faster!

💡 **Key Insight**: The beauty of this algorithm lies in its efficiency - instead of recalculating sums from scratch for each window, we cleverly add one element and remove another, maintaining our sum in constant time per step.`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} activeOpacity={1} />
        
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>🏆 Complete Solution</Text>
              <Text style={styles.headerSubtitle}>Intuition mapped to implementation</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Code Section */}
            <View style={styles.codeSection}>
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
                  <Text style={styles.codeText}>{code}</Text>
                </View>
              </View>
            </View>

            {/* Complexity Analysis Section */}
            <View style={styles.complexitySection}>
              <Text style={styles.complexitySectionTitle}>📊 Complexity Analysis</Text>
              <View style={styles.complexityContent}>
                {getComplexityAnalysis() && renderFormattedText(getComplexityAnalysis()!)}
              </View>
            </View>

            {/* Algorithm Walkthrough */}
            {problemData.solution?.optimal?.walkthrough && (
              <View style={styles.walkthroughSection}>
                <Text style={styles.walkthroughTitle}>🔍 Algorithm Steps</Text>
                <View style={styles.walkthroughContent}>
                  {problemData.solution.optimal.walkthrough.map((step: string, index: number) => (
                    <View key={index} style={styles.walkthroughStep}>
                      <Text style={styles.walkthroughStepNumber}>{index + 1}.</Text>
                      <Text style={styles.walkthroughStepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  modalContainer: {
    backgroundColor: '#111720',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E2632',
    width: '100%',
    maxWidth: 900,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
    backgroundColor: '#1A1D23',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  headerLeft: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#B4BCC8',
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: 16,
    color: '#B4BCC8',
    fontWeight: '600',
  },

  content: {
    flex: 1,
    padding: 20,
  },

  // Code Section
  codeSection: {
    marginBottom: 24,
  },

  terminalContainer: {
    backgroundColor: '#0A0E13',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2632',
    overflow: 'hidden',
  },

  terminalHeader: {
    backgroundColor: '#1A1D23',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
  },

  terminalButtons: {
    flexDirection: 'row',
    gap: 8,
  },

  terminalButton: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  terminalTitle: {
    fontSize: 14,
    color: '#B4BCC8',
    marginLeft: 16,
    fontFamily: 'monospace',
  },

  terminalContent: {
    padding: 20,
  },

  codeText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#10B981',
    lineHeight: 20,
  },

  // Complexity Section
  complexitySection: {
    backgroundColor: '#0C1116',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2632',
    padding: 20,
    marginBottom: 24,
  },

  complexitySectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F5D90A',
    marginBottom: 16,
  },

  complexityContent: {
    // Content styling handled by renderFormattedText
  },

  complexityText: {
    fontSize: 14,
    color: '#E8ECF2',
    lineHeight: 22,
  },

  boldText: {
    fontWeight: '700',
    color: '#E8ECF2',
  },

  highlightedComplexity: {
    color: '#F5D90A',
    backgroundColor: '#2A2A0A',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },

  // Walkthrough Section
  walkthroughSection: {
    backgroundColor: '#0C1116',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2632',
    padding: 20,
  },

  walkthroughTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#29D3FF',
    marginBottom: 16,
  },

  walkthroughContent: {
    gap: 12,
  },

  walkthroughStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  walkthroughStepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
    minWidth: 20,
  },

  walkthroughStepText: {
    fontSize: 14,
    color: '#B4BCC8',
    flex: 1,
    lineHeight: 20,
  },
});
