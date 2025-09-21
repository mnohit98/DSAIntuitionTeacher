import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface JarvisMessage {
  id: string;
  message: string;
  timestamp: Date;
}

interface Props {
  message: JarvisMessage | null;
  onAIAssistantPress?: () => void;
  isAILoading?: boolean;
  isCompleted?: boolean;
}

export default function JarvisChatPanel({ message, onAIAssistantPress, isAILoading = false, isCompleted = false }: Props) {
  const [isHighlighting, setIsHighlighting] = useState(false);
  const highlightAnim = useRef(new Animated.Value(0)).current;

  // Dynamic title based on completion state
  const getPanelTitle = () => {
    return isCompleted ? "Algorithm Steps" : "Step Guide";
  };

  // Render algorithm steps with enhanced styling
  const renderAlgorithmSteps = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    
    lines.forEach((line, index) => {
      if (line.includes('**Step')) {
        // Parse step line: **Step 1:** Description
        const match = line.match(/\*\*Step (\d+):\*\* (.+)/);
        if (match) {
          const stepNumber = match[1];
          const stepDescription = match[2];
          elements.push(
            <View key={index} style={styles.stepContainer}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>{stepNumber}</Text>
              </View>
              <Text style={styles.stepDescription}>{stepDescription}</Text>
            </View>
          );
        }
      } else if (line.trim() && !line.includes('**Step')) {
        // Handle any additional text
        elements.push(
          <Text key={index} style={styles.additionalText}>
            {line}
          </Text>
        );
      }
    });
    
    return elements;
  };

  // Container highlighting effect
  useEffect(() => {
    if (!message?.message) {
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
  }, [message?.message, message?.id, highlightAnim]); // Re-trigger when message changes

  // Interpolate values for smooth animations
  const borderColor = highlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1E2632', '#F5D90A'] // Normal border to yellow
  });

  const backgroundColor = highlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#0C1116', '#1A1A0D'] // Normal background to slight yellow tint
  });

  const shadowOpacity = highlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4] // No shadow to yellow glow
  });

  if (!message) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{getPanelTitle()}</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Ready to guide you through each step</Text>
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
        shadowColor: '#F5D90A',
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
        {isCompleted && message.message.includes('**Step') ? (
          // Render algorithm steps with special styling
          <View style={styles.algorithmStepsContainer}>
            {renderAlgorithmSteps(message.message)}
          </View>
        ) : (
          // Render normal message
          <Text style={styles.messageText}>
            {message.message}
          </Text>
        )}
      </ScrollView>

      {/* AI Assistant Button - Only show if onAIAssistantPress is provided */}
      {onAIAssistantPress && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.aiButton, isAILoading && styles.aiButtonLoading]}
            onPress={onAIAssistantPress}
            disabled={isAILoading}
            activeOpacity={0.8}
          >
            <Text style={styles.aiButtonIcon}>
              {isAILoading ? '⏳' : '🧠'}
            </Text>
            <Text style={styles.aiButtonText}>
              {isAILoading ? 'Thinking...' : 'Ask AI Assistant'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
    color: '#29D3FF',
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
    fontSize: 16,
    color: '#B4BCC8',
    textAlign: 'center',
  },
  messageContent: {
    minHeight: 20,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#E8ECF2',
  },
  
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1E2632',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#29D3FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#29D3FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  aiButtonLoading: {
    backgroundColor: '#6B7280',
    shadowColor: '#6B7280',
  },
  aiButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  aiButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#080A0D',
  },

  // Algorithm Steps Styling
  algorithmStepsContainer: {
    paddingVertical: 8,
  },
  algorithmStepsHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
  },
  algorithmStepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#29D3FF',
    marginBottom: 4,
  },
  algorithmStepsSubtitle: {
    fontSize: 12,
    color: '#B4BCC8',
    fontStyle: 'italic',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#111720',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#29D3FF',
    borderWidth: 1,
    borderColor: '#1E2632',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#29D3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginTop: 2,
    shadowColor: '#29D3FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#0C1116',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#080A0D',
  },
  stepDescription: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#E8ECF2',
    fontWeight: '500',
  },
  additionalText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#B4BCC8',
    textAlign: 'center',
    marginVertical: 8,
    fontStyle: 'italic',
  },
});
