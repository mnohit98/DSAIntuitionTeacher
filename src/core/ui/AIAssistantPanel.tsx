import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AIRequest } from '../services/AIServiceFactory';

interface Props {
  onAIRequest: (request: AIRequest) => void;
  isLoading: boolean;
  response: string | null;
  onAskMore: () => void;
  onEnlargePress?: () => void; // Optional enlarge button
  isModalView?: boolean; // Whether this is in modal or panel
  context: {
    currentStep: string;
    stepDescription: string;
    algorithmType: string;
    variables: Array<{
      name: string;
      value: any;
      description: string;
    }>;
    problemData: {
      title: string;
      description: string;
      aim: string;
    };
  };
}

export default function AIAssistantPanel({ 
  onAIRequest, 
  isLoading, 
  response, 
  onAskMore, 
  onEnlargePress,
  isModalView = false,
  context 
}: Props) {
  const [userQuery, setUserQuery] = useState('');
  const [showInput, setShowInput] = useState(true);
  const [activeDot, setActiveDot] = useState(0);

  const defaultQuery = "Hey AI assistant! Help me understand this particular step";
  const placeholderText = `Hey AI assistant! Help me understand this particular step.....

Or ask your own question about the problem !!`;
  const maxCharacters = 300; // Reasonable limit for questions

  // Animate thinking dots
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setActiveDot(prev => (prev + 1) % 3);
      }, 500); // Change active dot every 500ms
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleAIAssistantPress = () => {
    const queryToSend = userQuery.trim() || defaultQuery;
    
    const request: AIRequest = {
      userQuery: queryToSend,
      context: context
    };

    onAIRequest(request);
    setShowInput(false); // Hide input while processing
  };

  const handleAskMore = () => {
    setUserQuery('');
    setShowInput(true);
    onAskMore();
  };

  // Show response state
  if (!showInput && (response || isLoading)) {
    return (
      <View style={styles.container}>
        <View style={styles.responseContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Thinking...</Text>
              <View style={styles.loadingDots}>
                <Text style={[styles.dot, activeDot === 0 && styles.dotActive]}>●</Text>
                <Text style={[styles.dot, activeDot === 1 && styles.dotActive]}>●</Text>
                <Text style={[styles.dot, activeDot === 2 && styles.dotActive]}>●</Text>
              </View>
            </View>
          ) : response ? (
            <>
              {onEnlargePress && !isModalView && (
                <View style={styles.responseHeader}>
                  <TouchableOpacity 
                    style={styles.enlargeButton}
                    onPress={onEnlargePress}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.enlargeButtonText}>⛶</Text>
                  </TouchableOpacity>
                </View>
              )}
              <ScrollView style={[styles.responseScrollView, isModalView && styles.responseScrollViewModal]} showsVerticalScrollIndicator={false}>
                <Text style={styles.responseText}>{response}</Text>
              </ScrollView>
              <View style={styles.largeButtonSpacing} />
              <TouchableOpacity 
                style={styles.askMoreButton}
                onPress={handleAskMore}
                activeOpacity={0.8}
              >
                <Text style={styles.askMoreText}>Ask AI More</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </View>
    );
  }

  // Show input state
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={placeholderText}
            placeholderTextColor="#6B7280"
            value={userQuery}
            onChangeText={(text) => {
              if (text.length <= maxCharacters) {
                setUserQuery(text);
              }
            }}
            multiline
            numberOfLines={Platform.OS === 'ios' ? undefined : 5}
            textAlignVertical="top"
          />
          <View style={styles.characterCounter}>
            <Text style={[
              styles.counterText,
              userQuery.length > maxCharacters * 0.9 && styles.counterWarning
            ]}>
              {userQuery.length}/{maxCharacters}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.aiButton, isLoading && styles.aiButtonDisabled]}
          onPress={handleAIAssistantPress}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.aiButtonText}>
            {isLoading ? '⏳ Thinking...' : 'AI Assistant'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  
  inputContainer: {
    gap: 12,
  },
  
  textInputContainer: {
    position: 'relative',
  },
  
  textInput: {
    backgroundColor: '#0C1116',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E2632',
    padding: 16,
    paddingBottom: 35, // Space for character counter
    fontSize: 15,
    color: '#E8ECF2',
    minHeight: 140,
    maxHeight: 200,
    textAlignVertical: 'top',
    lineHeight: 22,
  },

  characterCounter: {
    position: 'absolute',
    bottom: 8,
    right: 12,
  },

  counterText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },

  counterWarning: {
    color: '#F59E0B',
  },
  
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#29D3FF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#29D3FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  aiButtonDisabled: {
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
  
  // Response state styles
  responseContainer: {
    gap: 12,
  },
  
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  
  loadingText: {
    fontSize: 14,
    color: '#E8ECF2',
    fontWeight: '500',
    marginBottom: 12,
  },
  
  loadingDots: {
    flexDirection: 'row',
    gap: 6,
  },
  
  dot: {
    fontSize: 16,
    color: '#6B7280',
    opacity: 0.4,
  },

  dotActive: {
    color: '#29D3FF',
    opacity: 1,
  },
  
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
  },

  enlargeButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#1E2632',
  },

  enlargeButtonText: {
    fontSize: 12,
    color: '#B4BCC8',
  },
  
  responseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#29D3FF',
  },

  buttonSpacing: {
    height: 12,
  },

  largeButtonSpacing: {
    height: 20, // More space before Ask AI More button
  },

  responseScrollView: {
    flex: 1,
    maxHeight: 250, // Increased default height for panel view
  },

  responseScrollViewModal: {
    maxHeight: 500, // Much larger in modal view for better readability
  },
  
  responseText: {
    fontSize: 14,
    color: '#E8ECF2',
    lineHeight: 20,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  
  askMoreButton: {
    backgroundColor: '#0C1116',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1E2632',
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  
  askMoreText: {
    fontSize: 12,
    color: '#29D3FF',
    fontWeight: '500',
  },
});
