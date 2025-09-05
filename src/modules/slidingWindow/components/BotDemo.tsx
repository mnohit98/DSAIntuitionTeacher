import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BotAvatar from './BotAvatar';

export default function BotDemo() {
  const [currentBot, setCurrentBot] = useState<'jarvis' | 'codebot'>('jarvis');
  const [isVisible, setIsVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const jarvisMessages = [
    "Welcome to the Sliding Window algorithm! I'm here to guide you through this fundamental pattern.",
    "The sliding window technique is perfect for solving problems involving arrays or strings where you need to find a subset that meets certain criteria.",
    "Think of it like a camera lens that slides over your data, capturing different views as it moves.",
    "Key concepts: window size (fixed or variable), what to track inside the window, and when to expand or contract."
  ];

  const codebotMessages = [
    "Let me show you how to implement the sliding window pattern step by step.",
    "Here's a basic template for fixed-size sliding window problems:",
    "For variable-size sliding window, we need to track additional conditions:",
    "Remember to handle edge cases and optimize your window operations!"
  ];

  const codeSnippets = [
    "",
    `function fixedSizeSlidingWindow(arr, k) {
  let sum = 0;
  let maxSum = 0;
  
  // Initialize first window
  for (let i = 0; i < k; i++) {
    sum += arr[i];
  }
  maxSum = sum;
  
  // Slide the window
  for (let i = k; i < arr.length; i++) {
    sum = sum - arr[i-k] + arr[i];
    maxSum = Math.max(maxSum, sum);
  }
  
  return maxSum;
}`,
    `function variableSizeSlidingWindow(arr, target) {
  let left = 0, right = 0;
  let sum = 0;
  let minLength = Infinity;
  
  while (right < arr.length) {
    sum += arr[right];
    
    while (sum >= target) {
      minLength = Math.min(minLength, right - left + 1);
      sum -= arr[left];
      left++;
    }
    right++;
  }
  
  return minLength === Infinity ? 0 : minLength;
}`,
    `// Edge cases to consider:
// 1. Empty array or single element
// 2. All elements are the same
// 3. Target sum is 0
// 4. Array with negative numbers
// 5. Window size larger than array length`
  ];

  const currentMessages = currentBot === 'jarvis' ? jarvisMessages : codebotMessages;
  const currentCodeSnippets = currentBot === 'jarvis' ? Array(jarvisMessages.length).fill("") : codeSnippets;

  useEffect(() => {
    if (isVisible) {
      setMessageIndex(0);
    }
  }, [isVisible, currentBot]);

  // Auto-start the demo when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000); // Start after 1 second

    return () => clearTimeout(timer);
  }, []);

  const handleTypingComplete = () => {
    setTimeout(() => {
      if (messageIndex < currentMessages.length - 1) {
        setMessageIndex(prev => prev + 1);
      }
    }, 1000); // Wait 1 second before showing next message
  };

  const resetDemo = () => {
    setIsVisible(false);
    setMessageIndex(0);
    setTimeout(() => setIsVisible(true), 500);
  };

  const switchBot = () => {
    setIsVisible(false);
    setMessageIndex(0);
    setTimeout(() => {
      setCurrentBot(prev => prev === 'jarvis' ? 'codebot' : 'jarvis');
      setIsVisible(true);
    }, 500);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Bot Avatar Demo</Text>
        <Text style={styles.subtitle}>Watch Jarvis and CodeBot in action!</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.botButton, currentBot === 'jarvis' && styles.activeBotButton]} 
          onPress={() => setCurrentBot('jarvis')}
        >
          <Text style={[styles.botButtonText, currentBot === 'jarvis' && styles.activeBotButtonText]}>
            🤖 Jarvis
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.botButton, currentBot === 'codebot' && styles.activeBotButton]} 
          onPress={() => setCurrentBot('codebot')}
        >
          <Text style={[styles.botButtonText, currentBot === 'codebot' && styles.activeBotButtonText]}>
            💻 CodeBot
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={resetDemo}>
          <Text style={styles.actionButtonText}>🔄 Reset Demo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={switchBot}>
          <Text style={styles.actionButtonText}>🔄 Switch Bot</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.botContainer}>
        <BotAvatar
          botType={currentBot}
          message={currentMessages[messageIndex]}
          codeSnippet={currentCodeSnippets[messageIndex]}
          isVisible={isVisible}
          onTypingComplete={handleTypingComplete}
        />
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Message {messageIndex + 1} of {currentMessages.length}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${((messageIndex + 1) / currentMessages.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Features:</Text>
        <Text style={styles.infoText}>• Beautiful bot avatars with distinct personalities</Text>
        <Text style={styles.infoText}>• Letter-by-letter typing animation</Text>
        <Text style={styles.infoText}>• Smooth entrance and exit animations</Text>
        <Text style={styles.infoText}>• Typing indicator while messages are being typed</Text>
        <Text style={styles.infoText}>• Code snippets with syntax highlighting</Text>
        <Text style={styles.infoText}>• Interactive controls to switch between bots</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    fontStyle: 'italic'
  },
  controls: {
    flexDirection: 'row',
    padding: 16,
    gap: 12
  },
  botButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center'
  },
  activeBotButton: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6'
  },
  botButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748B'
  },
  activeBotButtonText: {
    color: '#1D4ED8'
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center'
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  botContainer: {
    minHeight: 400
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 6,
    lineHeight: 20
  }
});
