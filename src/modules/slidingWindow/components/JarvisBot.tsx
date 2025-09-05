import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface Props {
  message: string;
  personality: string;
}

export default function JarvisBot({ message, personality }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
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
  }, [message]);

  const getPersonalityStyle = () => {
    switch (personality) {
      case 'encouraging':
        return {
          backgroundColor: '#F0F8FF', // Light blue background
          borderColor: '#1E90FF', // Blue border
          icon: '📝',
          noteColor: '#0066CC', // Blue text
        };
      case 'analytical':
        return {
          backgroundColor: '#F0FFF0', // Light green background
          borderColor: '#32CD32', // Green border
          icon: '🧠',
          noteColor: '#228B22', // Green text
        };
      case 'friendly':
        return {
          backgroundColor: '#FFF8DC', // Light yellow background
          borderColor: '#FFD700', // Gold border
          icon: '😊',
          noteColor: '#B8860B', // Dark goldenrod text
        };
      default:
        return {
          backgroundColor: '#F0F8FF',
          borderColor: '#1E90FF',
          icon: '📝',
          noteColor: '#0066CC',
        };
    }
  };

  const personalityStyle = getPersonalityStyle();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: personalityStyle.backgroundColor,
          borderColor: personalityStyle.borderColor,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{personalityStyle.icon}</Text>
        <Text style={[styles.title, { color: personalityStyle.noteColor }]}>Jarvis</Text>
        <Text style={styles.subtitle}>Your Learning Guide</Text>
      </View>
      
      <View style={styles.messageContainer}>
        <Text style={[styles.messageText, { color: personalityStyle.noteColor }]}>{message}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.tip}>💡 Tip: Take notes like you&apos;re in class!</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 16,
    borderWidth: 3,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: '#FEFEFE',
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
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  messageText: {
    fontSize: 16,
    color: '#166534',
    lineHeight: 24,
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
