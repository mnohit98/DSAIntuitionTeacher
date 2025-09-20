import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Variable } from '../types/engine';

interface Props {
  variables: Variable[];
  title?: string;
}

export default function AlgorithmState({ variables, title = "Algorithm State" }: Props) {
  if (!variables || variables.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.variablesGrid}>
          {variables.map((variable, index) => (
            <View key={index} style={styles.variableCard}>
              <Text style={styles.variableDescription}>{variable.description}</Text>
              <Text style={styles.variableValue}>{String(variable.value)}</Text>
              <Text style={styles.variableName}>{variable.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111720',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E2632',
    marginTop: 16,
    marginHorizontal: 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  header: {
    backgroundColor: '#1A1D23',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
  },

  headerTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#29D3FF',
  },

  content: {
    padding: 12,
  },

  variablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },

  variableCard: {
    backgroundColor: '#0C1116',
    borderRadius: 6,
    padding: 8,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E2632',
  },

  variableDescription: {
    fontSize: 10,
    color: '#29D3FF',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 12,
    marginBottom: 4,
  },

  variableValue: {
    fontSize: 14,
    color: '#10B981',
    fontFamily: 'monospace',
    fontWeight: '700',
    marginBottom: 3,
    textAlign: 'center',
  },

  variableName: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 10,
    fontStyle: 'italic',
  },
});
