import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  description: string;
  expectedAction: string;
  codeHint?: string;
}

export default function StepDescription({ 
  description, 
  expectedAction,
  codeHint 
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 Current Step</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description}>{description}</Text>
        
        {codeHint && (
          <View style={styles.codeHintContainer}>
            <Text style={styles.codeHintLabel}>💻 Code Hint:</Text>
            <Text style={styles.codeHintText}>{codeHint}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#32CD32',
    borderStyle: 'dashed',
    padding: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    flex: 1,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#228B22',
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'left',
  },
  expectedAction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'left',
  },
  codeHintContainer: {
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4B5563',
    marginBottom: 12,
  },
  codeHintLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D1D5DB',
    marginBottom: 6,
  },
  codeHintText: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: 'monospace',
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    lineHeight: 20,
  },
});
