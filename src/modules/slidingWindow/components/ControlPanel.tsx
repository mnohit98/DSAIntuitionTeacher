import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  currentStep: any;
  onAction: (action: string, elementIndex?: number) => void;
}

export default function ControlPanel({ currentStep, onAction }: Props) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (currentStep.expectedAction === 'click_initialize') {
      console.log('Starting blink animation for initialize button');
      setIsBlinking(true);
      
      // Simple blinking using setInterval
      const blinkInterval = setInterval(() => {
        setOpacity(prev => prev === 1 ? 0.3 : 1);
      }, 800);

      return () => {
        clearInterval(blinkInterval);
        setOpacity(1);
        setIsBlinking(false);
      };
    } else {
      setOpacity(1);
      setIsBlinking(false);
    }
  }, [currentStep.expectedAction]);

  const getActionButton = () => {
    switch (currentStep.expectedAction) {
      case 'click_initialize':
        return (
          <View style={{ opacity: opacity }}>
            <TouchableOpacity
              style={[
                styles.button, 
                styles.primaryButton,
                isBlinking && styles.blinkingButton
              ]}
              onPress={() => onAction('click_initialize')}
            >
              <Text style={styles.primaryButtonText}>🚀 Initialize Variables</Text>
            </TouchableOpacity>
          </View>
        );
      case 'add_element_to_window':
        return (
          <View style={styles.actionContainer}>
            <Text style={styles.actionHint}>
              {currentStep.hideIndexHint
                ? '💡 Choose the better end to add to the window'
                : `💡 Click on element ${currentStep.expectedElementIndex} to add it to the window`}
            </Text>
          </View>
        );
      case 'complete_first_window':
        return (
          <View style={styles.actionContainer}>
            <Text style={styles.actionHint}>
              {currentStep.hideIndexHint
                ? '💡 Choose the better end to complete the first window'
                : `💡 Click on element ${currentStep.expectedElementIndex} to complete the first window`}
            </Text>
          </View>
        );
      case 'slide_window':
        return (
          <View style={styles.actionContainer}>
            <Text style={styles.actionHint}>
              {currentStep.hideIndexHint
                ? '💡 Choose which end produces a better next window'
                : `💡 Click on element ${currentStep.expectedElementIndex} to slide the window`}
            </Text>
          </View>
        );
      case 'expand_window':
        return (
          <View style={styles.actionContainer}>
            <Text style={styles.actionHint}>
              🔍 Click on element {currentStep.expectedElementIndex} to expand the window (move right)
            </Text>
          </View>
        );
      case 'contract_window':
        return (
          <View style={styles.actionContainer}>
            <Text style={styles.actionHint}>
              ✂️ Click on element {currentStep.expectedElementIndex} to contract the window (move left)
            </Text>
          </View>
        );
      case 'update_best':
        return (
          <View style={styles.actionContainer}>
            <Text style={styles.actionHint}>
              ⭐ Click on element {currentStep.expectedElementIndex} to update the best answer so far
            </Text>
          </View>
        );
      case 'complete_algorithm':
        return (
          <View style={styles.actionContainer}>
            <Text style={styles.actionHint}>✅ Click the last element to finish the walkthrough</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Current Step Description */}
      <View style={styles.stepInfo}>
        <Text style={styles.stepTitle}>Step {currentStep.stepId}:</Text>
        <Text style={styles.stepDescription}>{currentStep.description}</Text>
      </View>

      {/* Action Button / Hint */}
      {getActionButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    padding: 0,
    elevation: 0,
    flex: 1,
  },

  actionContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 0,
    borderRadius: 0,
    borderWidth: 0,
    marginBottom: 0,
  },
  actionHint: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B4BCC8',
    textAlign: 'left',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  actionHintText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B4BCC8',
    textAlign: 'left',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  actionHintIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  stepInfo: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingVertical: 4,
    paddingHorizontal: 0,
    marginBottom: 4,
    borderWidth: 0,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E8ECF2',
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 12,
    color: '#B4BCC8',
    lineHeight: 16,
    marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: 'transparent',
    elevation: 0,
  },
  primaryButton: {
    backgroundColor: '#F5D90A',
    borderColor: '#F5D90A',
    shadowColor: '#F5D90A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  blinkingButton: {
    borderWidth: 3,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 1,
    shadowRadius: 20,
    backgroundColor: '#FFD700',
  },
  primaryButtonText: {
    color: '#080A0D',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  secondaryButton: {
    backgroundColor: '#111720',
    borderColor: '#1E2632',
  },
  secondaryButtonText: {
    color: '#B4BCC8',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  codeHint: {
    fontSize: 12,
    color: '#B4BCC8',
    fontFamily: 'monospace',
    backgroundColor: 'transparent',
    padding: 0,
    borderRadius: 0,
    borderWidth: 0,
  },
});
