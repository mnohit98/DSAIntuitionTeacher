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
  isCompleted?: boolean;
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

export default function CodePanel({ codeInfo, isCompleted = false }: Props) {
  const [isHighlighting, setIsHighlighting] = useState(false);
  const highlightAnim = useRef(new Animated.Value(0)).current;

  // Dynamic title based on completion state
  const getPanelTitle = () => {
    return isCompleted ? "Complexity Analysis" : "Code Implementation";
  };

  // Render complexity analysis with enhanced styling
  const renderComplexityAnalysis = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentSection = '';
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('COMPLEXITY ANALYSIS')) {
        // Skip the title - we don't need it
        return;
      } else if (trimmedLine && !trimmedLine.startsWith('**') && !currentSection && index > 0) {
        // Overview section (content after title but before first metric)
        elements.push(
          <View key={index} style={styles.complexityOverview}>
            <Text style={styles.complexityOverviewText}>{trimmedLine}</Text>
          </View>
        );
      } else if (trimmedLine.startsWith('**Time Complexity')) {
        // Time complexity section
        currentSection = 'time';
        const match = trimmedLine.match(/\*\*Time Complexity.*?:\s*(.+?)\*\*/);
        const value = match ? match[1] : 'Not specified';
        elements.push(
          <View key={index} style={styles.complexitySection}>
            <View style={styles.complexityMetricHeader}>
              <Text style={styles.complexityMetricIcon}>⏱️</Text>
              <Text style={styles.complexityMetricTitle}>Time Complexity</Text>
              <View style={styles.complexityBadge}>
                <Text style={styles.complexityBadgeText}>{value}</Text>
              </View>
            </View>
          </View>
        );
      } else if (trimmedLine.startsWith('**Space Complexity')) {
        // Space complexity section
        currentSection = 'space';
        const match = trimmedLine.match(/\*\*Space Complexity.*?:\s*(.+?)\*\*/);
        const value = match ? match[1] : 'Not specified';
        elements.push(
          <View key={index} style={styles.complexitySection}>
            <View style={styles.complexityMetricHeader}>
              <Text style={styles.complexityMetricIcon}>💾</Text>
              <Text style={styles.complexityMetricTitle}>Space Complexity</Text>
              <View style={styles.complexityBadge}>
                <Text style={styles.complexityBadgeText}>{value}</Text>
              </View>
            </View>
          </View>
        );
      } else if (trimmedLine.includes('Algorithm Insight')) {
        // Algorithm insight section - remove ** stars
        currentSection = 'insight';
        elements.push(
          <Text key={index} style={styles.simpleHeading}>Algorithm Insight</Text>
        );
      } else if (trimmedLine.includes('Why This Matters')) {
        // Why it matters section - remove ** stars and emoji
        currentSection = 'matters';
        elements.push(
          <Text key={index} style={styles.simpleHeading}>Why This Matters</Text>
        );
      } else if (trimmedLine && !trimmedLine.startsWith('**') && currentSection) {
        // Content for current section
        const isExplanation = currentSection === 'time' || currentSection === 'space';
        const isSimpleText = currentSection === 'insight' || currentSection === 'matters';
        
        if (isSimpleText) {
          // Simple text block for insight and matters
          elements.push(
            <Text key={index} style={styles.simpleText}>
              {trimmedLine}
            </Text>
          );
        } else {
          // Styled cards for explanations
          elements.push(
            <View key={index} style={styles.complexityExplanation}>
              <Text style={styles.complexityExplanationText}>
                {trimmedLine}
              </Text>
            </View>
          );
        }
      }
    });
    
    return elements;
  };

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
          <Text style={styles.headerTitle}>{getPanelTitle()}</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {isCompleted ? "Complexity analysis will appear here" : "Code will appear as you progress"}
          </Text>
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
        <Text style={styles.headerTitle}>{getPanelTitle()}</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {isCompleted && codeInfo.codeSnippet && codeInfo.codeSnippet.includes('COMPLEXITY ANALYSIS') ? (
          // Render complexity analysis with special styling
          <View style={styles.complexityContainer}>
            {renderComplexityAnalysis(codeInfo.codeSnippet)}
          </View>
        ) : (
          // Render normal code content
          <>
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{codeInfo.codeSnippet || 'No code available'}</Text>
            </View>
            {codeInfo.codeExplanation && (
              <View style={styles.explanationContainer}>
                <Text style={styles.explanationTitle}>Intuition → Code</Text>
                {renderFormattedText(codeInfo.codeExplanation)}
              </View>
            )}
          </>
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

  // Complexity Analysis Styling
  complexityContainer: {
    padding: 16,
  },
  complexityOverview: {
    backgroundColor: '#0F1419',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#29D3FF',
    borderWidth: 1,
    borderColor: '#1E2632',
  },
  complexityOverviewText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#B4BCC8',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  complexitySection: {
    marginBottom: 12,
    backgroundColor: 'transparent',
    padding: 0,
  },
  complexityMetricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  complexityMetricIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  complexityMetricTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E8ECF2',
    flex: 1,
  },
  complexityBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
  },
  complexityBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0A0E13',
  },
  complexityExplanation: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    marginTop: 4,
    marginLeft: 24,
    borderWidth: 0,
  },
  complexityExplanationText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#B4BCC8',
    fontStyle: 'normal',
  },

  // Simple styling for insight sections
  simpleHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#29D3FF',
    marginTop: 20,
    marginBottom: 8,
  },
  simpleText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#E8ECF2',
    marginBottom: 12,
  },
});
