import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';

interface CodeInfo {
  id: string;
  codeSnippet: string | null;
  codeExplanation?: string;
  timestamp: Date;
}

interface Props {
  codeInfo: CodeInfo | null;
}

// Function to render text with bold formatting for TC/SC
const renderFormattedText = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return (
    <Text style={styles.explanationText}>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          // Check if it's TC or SC for special coloring
          const isTCOrSC = boldText.includes('Time Complexity') || boldText.includes('Space Complexity');
          return (
            <Text 
              key={index} 
              style={[
                styles.boldText, 
                isTCOrSC && styles.complexityText
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

export default function CodePanel({ codeInfo }: Props) {
  const [isHighlighting, setIsHighlighting] = useState(false);
  const highlightAnim = useRef(new Animated.Value(0)).current;

  // Container highlighting effect
  useEffect(() => {
    if (!codeInfo?.codeSnippet) {
      return;
    }

    // Start highlighting animation for attention
    setIsHighlighting(true);
    
    const highlightAnimation = Animated.sequence([
      Animated.timing(highlightAnim, { 
        toValue: 1, 
        duration: 400, 
        easing: Easing.inOut(Easing.quad), 
        useNativeDriver: false 
      }),
      Animated.timing(highlightAnim, { 
        toValue: 0, 
        duration: 400, 
        easing: Easing.inOut(Easing.quad), 
        useNativeDriver: false 
      }),
    ]); // Single highlight only

    highlightAnimation.start(() => {
      setIsHighlighting(false);
      highlightAnim.setValue(0); // Ensure it ends at normal state
    });

    return () => {
      highlightAnimation.stop();
      setIsHighlighting(false);
      highlightAnim.setValue(0);
    };
  }, [codeInfo?.codeSnippet, codeInfo?.id, highlightAnim]); // Re-trigger when code changes

  // Interpolate values for smooth animations
  const borderColor = highlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1E2632', '#10B981'] // Normal border to green
  });

  const backgroundColor = highlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#0C1116', '#0D1A0F'] // Normal background to slight green tint
  });

  const shadowOpacity = highlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4] // No shadow to green glow
  });

  if (!codeInfo) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>💻 Code Implementation</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Code will appear as you progress</Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={[
      styles.container,
      {
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        shadowColor: '#10B981',
        shadowOpacity: shadowOpacity,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 8,
      }
    ]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💻 Code Implementation</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>{codeInfo.codeSnippet || 'No code available'}</Text>
        </View>
        {codeInfo.codeExplanation && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationTitle}>🔗 Intuition → Code</Text>
            {renderFormattedText(codeInfo.codeExplanation)}
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C1116',
    borderWidth: 2,
    borderColor: '#1E2632',
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
    backgroundColor: '#111720',
  },

  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },

  scrollView: {
    flex: 1,
    padding: 16,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  codeContainer: {
    backgroundColor: '#0A0E13',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E2632',
    marginBottom: 12,
  },

  codeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#10B981',
    lineHeight: 16,
  },

  explanationContainer: {
    backgroundColor: '#111720',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E2632',
  },

  explanationTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F5D90A',
    marginBottom: 6,
  },

  explanationText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#B4BCC8',
    fontStyle: 'italic',
  },

  boldText: {
    fontWeight: '700',
    fontStyle: 'normal',
    color: '#E8ECF2',
  },

  complexityText: {
    color: '#F5D90A',
    backgroundColor: '#2A2A0A',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
