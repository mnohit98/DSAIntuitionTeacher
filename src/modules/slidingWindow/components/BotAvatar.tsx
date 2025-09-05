import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface Props {
  botType: 'jarvis' | 'codebot';
  message: string;
  codeSnippet?: string;
  isVisible: boolean;
  onTypingComplete?: () => void;
}

export default function BotAvatar({ 
  botType,
  message,
  codeSnippet,
  isVisible,
  onTypingComplete 
}: Props) {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const avatarScale = useRef(new Animated.Value(0.8)).current;
  const typingIndicator = useRef(new Animated.Value(0)).current;
  const cursorAnim = useRef(new Animated.Value(1)).current;

  const botConfig = {
    jarvis: {
      name: 'Jarvis',
      icon: '🤖',
      color: '#1E90FF',
      bgColor: '#F0F8FF',
      borderColor: '#1E90FF',
      subtitle: 'Your Learning Guide',
      personality: 'encouraging'
    },
    codebot: {
      name: 'CodeBot',
      icon: '💻',
      color: '#8B5CF6',
      bgColor: '#F0F0FF',
      borderColor: '#8B5CF6',
      subtitle: 'Implementation Notes',
      personality: 'analytical'
    }
  };

  const config = botConfig[botType];

  const startTyping = useCallback(() => {
    setIsTyping(true);
    setDisplayedMessage('');
    setDisplayedCode('');

    // Type message letter by letter
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (messageIndex < message.length) {
        setDisplayedMessage(prev => prev + message[messageIndex]);
        messageIndex++;
      } else {
        clearInterval(messageInterval);
        
        // Start typing code if available
        if (codeSnippet) {
          let codeIndex = 0;
          const codeInterval = setInterval(() => {
            if (codeIndex < codeSnippet.length) {
              setDisplayedCode(prev => prev + codeSnippet[codeIndex]);
              codeIndex++;
            } else {
              clearInterval(codeInterval);
              setIsTyping(false);
              onTypingComplete?.();
            }
          }, 30); // Faster typing for code
        } else {
          setIsTyping(false);
          onTypingComplete?.();
        }
      }
    }, 50); // Slower typing for messages
  }, [message, codeSnippet, onTypingComplete]);

  useEffect(() => {
    if (isVisible) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true
        }),
        Animated.spring(avatarScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true
        })
      ]).start();

      // Start typing animation
      startTyping();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(slideAnim, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(avatarScale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [isVisible, fadeAnim, slideAnim, avatarScale, startTyping]);

  useEffect(() => {
    if (message && isVisible) {
      startTyping();
    }
  }, [message, isVisible, startTyping]);

  // Animate typing indicator
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingIndicator, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true
          }),
          Animated.timing(typingIndicator, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true
          })
        ])
      ).start();
    }
  }, [isTyping, typingIndicator]);

  // Animate cursor blinking
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(cursorAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
          }),
          Animated.timing(cursorAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
          })
        ])
      ).start();
    }
  }, [isTyping, cursorAnim]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: avatarScale }
          ]
        }
      ]}
    >
      {/* Bot Avatar Header */}
      <View style={[styles.avatarHeader, { backgroundColor: config.bgColor }]}>
        <Animated.View style={[styles.avatarContainer, { borderColor: config.borderColor }]}>
          <Text style={styles.avatarIcon}>{config.icon}</Text>
        </Animated.View>
        <View style={styles.botInfo}>
          <Text style={[styles.botName, { color: config.color }]}>{config.name}</Text>
          <Text style={styles.botSubtitle}>{config.subtitle}</Text>
        </View>
        {isTyping && (
          <Animated.View style={[styles.typingIndicator, { opacity: typingIndicator }]}>
            <Text style={styles.typingText}>typing...</Text>
          </Animated.View>
        )}
      </View>

      {/* Message Content */}
      <View style={styles.messageContainer}>
        <Text style={[styles.messageText, { color: config.color }]}>
          {displayedMessage}
          {isTyping && message.length > displayedMessage.length && (
            <Animated.Text style={[styles.cursor, { opacity: cursorAnim }]}>|</Animated.Text>
          )}
        </Text>
      </View>

      {/* Code Snippet */}
      {codeSnippet && (
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>💻 Code Implementation:</Text>
          <Text style={styles.codeSnippet}>
            {displayedCode}
            {isTyping && codeSnippet.length > displayedCode.length && (
              <Animated.Text style={[styles.cursor, { opacity: cursorAnim }]}>|</Animated.Text>
            )}
          </Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.tip}>
          {botType === 'jarvis' 
            ? '💡 Tip: Take notes like you\'re in class!' 
            : '🔍 Note: This code shows exactly what happens when you perform the action!'
          }
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 20,
    borderWidth: 2,
    padding: 0,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden'
  },
  avatarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)'
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4
  },
  avatarIcon: {
    fontSize: 28
  },
  botInfo: {
    flex: 1
  },
  botName: {
    fontSize: 24,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  botSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    fontWeight: '600',
    marginTop: 2
  },
  typingIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  typingText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic'
  },
  messageContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  messageText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24
  },
  cursor: {
    color: '#FF6B6B',
    fontWeight: 'bold'
  },
  codeContainer: {
    margin: 20,
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4B5563',
    borderStyle: 'dashed'
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D1D5DB',
    marginBottom: 8
  },
  codeSnippet: {
    fontSize: 14,
    color: '#10B981',
    fontFamily: 'monospace',
    lineHeight: 20,
    fontWeight: '600'
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    padding: 16,
    backgroundColor: 'rgba(248, 250, 252, 0.8)'
  },
  tip: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '600'
  }
});
