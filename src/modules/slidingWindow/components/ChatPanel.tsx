import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Message {
  id: string;
  sender: 'jarvis' | 'codebot';
  message: string;
  codeSnippet?: string;
  timestamp: Date;
}

interface Props {
  messages: Message[];
  onAIAssistantPress?: () => void;
  isAILoading?: boolean;
}

export default function ChatPanel({ messages, onAIAssistantPress, isAILoading = false }: Props) {
  const renderMessage = (msg: Message) => {
    const isJarvis = msg.sender === 'jarvis';
    
    return (
      <View key={msg.id} style={[
        styles.messageBubble,
        isJarvis ? styles.jarvisBubble : styles.codebotBubble
      ]}>
        <View style={styles.messageHeader}>
          <Text style={styles.senderIcon}>
            {isJarvis ? '📝' : '💻'}
          </Text>
          <Text style={[
            styles.senderName,
            isJarvis ? styles.jarvisName : styles.codebotName
          ]}>
            {isJarvis ? 'Jarvis' : 'CodeBot'}
          </Text>
          <Text style={styles.timestamp}>
            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        <View style={styles.messageContent}>
          <Text style={[
            styles.messageText,
            isJarvis ? styles.jarvisText : styles.codebotText
          ]}>
            {msg.message}
          </Text>
          
          {msg.codeSnippet && (
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>💻 Code:</Text>
              <Text style={styles.codeSnippet}>{msg.codeSnippet}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* AI Assistant Button */}
      {onAIAssistantPress && (
        <View style={styles.aiButtonContainer}>
          <TouchableOpacity 
            style={[styles.aiButton, isAILoading && styles.aiButtonLoading]}
            onPress={onAIAssistantPress}
            activeOpacity={0.8}
            disabled={isAILoading}
          >
            <Text style={styles.aiButtonIcon}>🤖</Text>
            <Text style={styles.aiButtonText}>
              {isAILoading ? 'AI Thinking...' : 'AI Step Explanation'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView 
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Start the algorithm to see guidance from Jarvis and CodeBot!</Text>
          </View>
        ) : (
          messages.map(renderMessage)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 8,
  },
  messageBubble: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    maxWidth: '100%',
    backgroundColor: '#0C1116',
    borderWidth: 1,
    borderColor: '#1E2632',
  },
  jarvisBubble: {
    borderLeftWidth: 3,
    borderLeftColor: '#29D3FF',
  },
  codebotBubble: {
    borderLeftWidth: 3,
    borderLeftColor: '#F5D90A',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  senderIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  senderName: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 8,
  },
  jarvisName: {
    color: '#29D3FF',
  },
  codebotName: {
    color: '#F5D90A',
  },
  timestamp: {
    fontSize: 10,
    color: '#B4BCC8',
    marginLeft: 'auto',
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  jarvisText: {
    color: '#E8ECF2',
  },
  codebotText: {
    color: '#E8ECF2',
  },
  codeContainer: {
    backgroundColor: '#080A0D',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E2632',
    marginTop: 8,
  },
  codeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F5D90A',
    marginBottom: 6,
  },
  codeSnippet: {
    fontSize: 11,
    color: '#29D3FF',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 13,
    color: '#B4BCC8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  aiButtonContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5D90A',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F5D90A',
  },
  aiButtonLoading: {
    backgroundColor: '#1E2632',
    borderColor: '#1E2632',
  },
  aiButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  aiButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#080A0D',
  },
});
