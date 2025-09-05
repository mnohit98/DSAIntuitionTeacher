import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface Props {
  message: string;
  codeSnippet: string;
  isVisible: boolean;
}

export default function CodeBot({ message, codeSnippet, isVisible }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (isVisible) {
      // Animate in when message changes
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>💻</Text>
        <Text style={styles.title}>CodeBot</Text>
        <Text style={styles.subtitle}>Implementation Notes</Text>
      </View>
      
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{message}</Text>
      </View>

      <View style={styles.codeContainer}>
        <Text style={styles.codeLabel}>💻 Code Implementation:</Text>
        <Text style={styles.codeSnippet}>{codeSnippet}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.tip}>🔍 Note: This code shows exactly what happens when you perform the action!</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#8B5CF6',
    padding: 20,
    backgroundColor: '#FEFEFE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#6A0DAD',
    marginRight: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  messageContainer: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  messageText: {
    fontSize: 16,
    color: '#92400E',
    lineHeight: 24,
  },
  codeContainer: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4B5563',
    borderStyle: 'dashed',
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D1D5DB',
    marginBottom: 8,
  },
  codeSnippet: {
    fontSize: 15,
    color: '#92400E',
    fontFamily: 'monospace',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: 8,
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 12,
  },
  tip: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '600',
  },
});
