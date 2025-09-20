import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AIRequest } from '../services/AIServiceFactory';
import AIAssistantPanel from './AIAssistantPanel';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onAIRequest: (request: AIRequest) => void;
  isLoading: boolean;
  response: string | null;
  onAskMore: () => void;
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

export default function AIModal({ 
  isVisible, 
  onClose, 
  onAIRequest, 
  isLoading, 
  response, 
  onAskMore, 
  context 
}: Props) {
  if (!isVisible) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <TouchableOpacity 
        style={styles.modalBackdrop}
        onPress={onClose}
        activeOpacity={1}
      />
      
      {/* Modal Content */}
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>AI Assistant</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.modalContent}>
          <AIAssistantPanel
            onAIRequest={onAIRequest}
            isLoading={isLoading}
            response={response}
            onAskMore={onAskMore}
            isModalView={true}
            context={context}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 2000,
  },

  modalContainer: {
    position: 'absolute',
    top: '10%',
    left: '15%',
    right: '15%',
    bottom: '10%',
    backgroundColor: '#0C1116',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2632',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 2001,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
    backgroundColor: '#111720',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#29D3FF',
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1D23',
    borderWidth: 1,
    borderColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: 14,
    color: '#B4BCC8',
    fontWeight: '600',
  },

  modalContent: {
    flex: 1,
    padding: 20,
  },
});
